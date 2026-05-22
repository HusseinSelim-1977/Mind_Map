import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useOptimisticTask } from "./useOptimisticTask";
describe("useOptimisticTask", () => {
  it("updates and rolls back", () => {
    const { result } = renderHook(() => useOptimisticTask([{ id: "1", status: "TODO" }]));
    let rollback: any;
    act(() => { rollback = result.current.updateTask("1", "DONE"); });
    expect(result.current.tasks[0].status).toBe("DONE");
    act(() => rollback());
    expect(result.current.tasks[0].status).toBe("TODO");
  });
});
