import { test, describe, expect, afterEach } from "vitest";
import { useBox } from "../useBox";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, waitFor } from "@testing-library/react";

const axiosMock = new MockAdapter(axios);

afterEach(() => {
  axiosMock.reset();
});

describe("fetching box data", () => {
  test("should fetch box data successfully", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData, {
      "next-box": "3",
      "previous-box": "1"
    });

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.box).toEqual(mockBoxData);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(true);
  });

  test("should handle missing next-box header", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData, {
      "previous-box": "1"
    });

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.box).toEqual(mockBoxData);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(true);
  });

  test("should handle missing previous-box header", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData, {
      "next-box": "3"
    });
    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.box).toEqual(mockBoxData);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(false);
  });

  test("should handle missing next-box and previous-box headers", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData);

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.box).toEqual(mockBoxData);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(false);
  });

  test("should handle error when fetching box data", async () => {
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(404);

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.box).toBeNull();
    expect(result.current.error).toBeDefined();
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(false);
  });
});

describe("swapping boxes", () => {
  test("should swap boxes successfully and refresh due to swapping in current box", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData);
    axiosMock.onPatch(`http://cs732-test.com/api/boxes`).reply(200);

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    await result.current.swap({ boxNumber: 2, slotNumber: 1 }, { boxNumber: 2, slotNumber: 2 });

    expect(result.current.error).toBeNull();
    expect(axiosMock.history.patch.length).toBe(1);
    expect(axiosMock.history.patch[0].data).toBe(
      JSON.stringify({
        swap: { source: { boxNumber: 2, slotNumber: 1 }, target: { boxNumber: 2, slotNumber: 2 } }
      })
    );

    // Ensure the box is refreshed after swap
    await waitFor(() => expect(axiosMock.history.get.length).toBe(2));
  });

  test("should swap boxes successfully and NOT refresh due to swapping in different box", async () => {
    const mockBoxData = { boxNumber: 2, pokemon: [] };
    axiosMock.onGet(`http://cs732-test.com/api/boxes/2`).reply(200, mockBoxData);
    axiosMock.onPatch(`http://cs732-test.com/api/boxes`).reply(200);

    const { result } = renderHook(() => useBox(2));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    await result.current.swap({ boxNumber: 1, slotNumber: 1 }, { boxNumber: 1, slotNumber: 2 });

    expect(result.current.error).toBeNull();
    expect(axiosMock.history.patch.length).toBe(1);
    expect(axiosMock.history.patch[0].data).toBe(
      JSON.stringify({
        swap: { source: { boxNumber: 1, slotNumber: 1 }, target: { boxNumber: 1, slotNumber: 2 } }
      })
    );

    // Ensure the box is NOT refreshed after swap
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
  });
});
