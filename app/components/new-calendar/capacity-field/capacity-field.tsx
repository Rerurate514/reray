import {
  defaultSlotCapacity,
  maxSlotCapacity,
} from "../../../domain/calendar/services/normalizeSlotCapacity";

export function CapacityField() {
  return (
    <fieldset class="grid gap-3 border-t border-(--color-border) pt-5">
      <legend class="text-sm font-semibold">1枠あたりの定員</legend>
      <label class="grid gap-2">
        <input
          class="reray-input w-32 px-3 py-3"
          type="number"
          name="capacity"
          value={defaultSlotCapacity}
          min={1}
          max={maxSlotCapacity}
          required
        />
        <span class="text-xs text-(--color-muted)">
          同じ日に参加できる人数です。1 なら1人1枠、2
          以上なら複数人で1つの枠を分担できます。
        </span>
      </label>
    </fieldset>
  );
}
