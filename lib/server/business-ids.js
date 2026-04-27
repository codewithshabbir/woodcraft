import Counter from "@/lib/models/Counter";

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const initializedCounters = new Set();

async function getMaxNumericSuffix({ model, prefix, extraMatch = {}, session }) {
  const prefixEscaped = escapeRegExp(prefix);
  const idRegex = new RegExp(`^${prefixEscaped}-\\d+$`, "i");

  const pipeline = [
    { $match: { ...extraMatch, id: { $regex: idRegex } } },
    {
      $project: {
        _n: {
          $toInt: {
            $arrayElemAt: [{ $split: ["$id", "-"] }, 1],
          },
        },
      },
    },
    { $group: { _id: null, max: { $max: "$_n" } } },
  ];

  const agg = model.aggregate(pipeline);
  if (session) agg.session(session);
  const rows = await agg.exec();
  return Number(rows?.[0]?.max || 0);
}

export async function getNextSequence(name, { session } = {}) {
  const updated = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 }, $setOnInsert: { name, value: 0 } },
    { new: true, upsert: true, session },
  ).lean();

  return Number(updated?.value || 0);
}

export async function getNextBusinessId({ counterName, model, prefix, pad = 3, extraMatch = {}, session }) {
  // One-time per-process initialization: align the counter to existing data (prevents duplicates after migration).
  const initKey = `${counterName}:${prefix}:${JSON.stringify(extraMatch || {})}`;
  if (!initializedCounters.has(initKey)) {
    const query = Counter.findOne({ name: counterName }).select("value").lean();
    if (session) query.session(session);
    const current = await query;

    const maxExisting = await getMaxNumericSuffix({ model, prefix, extraMatch, session });
    if (!current) {
      await Counter.updateOne(
        { name: counterName },
        { $setOnInsert: { name: counterName, value: maxExisting } },
        { upsert: true, session },
      );
    } else if (Number.isFinite(maxExisting) && maxExisting > Number(current.value || 0)) {
      await Counter.updateOne({ name: counterName }, { $set: { value: maxExisting } }, { session });
    }

    initializedCounters.add(initKey);
  }

  const seq = await getNextSequence(counterName, { session });
  return `${prefix}-${String(seq).padStart(pad, "0")}`;
}
