/**
 * Maximum precision (number of decimal places) for counter values.
 *
 * ⚠️ IMPORTANT: If you change this constant, you MUST create a migration
 * to update the `counter_events_apply_delta` trigger in the database.
 * The trigger uses ROUND() with this precision value, and existing databases
 * will have the old precision value hardcoded in the trigger.
 *
 * Note: The trigger definition in src/entities/counterEvent/model/table.ts
 * uses this constant directly, so it will automatically use the new value
 * for new databases. However, existing databases need a migration.
 *
 * See: src/shared/db/migrations/20260212_02_add_rounding_to_counter_events_trigger.ts
 * for an example of how to update the trigger in a migration.
 */
export const NUM_COUNTER_MAX_PRECISION = 2
export const numCounterInputStep = `0.${'0'.repeat(NUM_COUNTER_MAX_PRECISION - 1)}1`
