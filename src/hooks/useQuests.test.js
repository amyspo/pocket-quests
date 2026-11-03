// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useQuests from "./useQuests.js";
import { getLocalDateKey, STORAGE_KEY } from "../utils/questState.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderUseQuests() {
  let latestValue;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function HookHarness() {
    latestValue = useQuests();
    return null;
  }

  act(() => {
    root.render(createElement(HookHarness));
  });

  return {
    get value() {
      return latestValue;
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "quest-test-id"),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("useQuests", () => {
  it("creates, edits, completes, and deletes a quest", () => {
    const harness = renderUseQuests();
    const initialQuestCount = harness.value.quests.length;

    act(() => {
      harness.value.addQuest({ name: "Bake cookies", emoji: "🍪" });
    });

    expect(harness.value.quests).toHaveLength(initialQuestCount + 1);
    const createdQuest = harness.value.quests.find(
      (quest) => quest.id === "quest-test-id",
    );
    expect(createdQuest).toMatchObject({
      name: "Bake cookies",
      emoji: "🍪",
      completionDates: [],
    });

    act(() => {
      harness.value.editQuest(createdQuest.id, {
        name: "Bake oatmeal cookies",
        emoji: "🥣",
      });
    });

    expect(
      harness.value.quests.find((quest) => quest.id === createdQuest.id),
    ).toMatchObject({
      name: "Bake oatmeal cookies",
      emoji: "🥣",
      completionDates: [],
    });

    act(() => {
      harness.value.toggleQuestCompletion(createdQuest.id);
    });

    expect(
      harness.value.quests.find((quest) => quest.id === createdQuest.id)
        .completionDates,
    ).toContain(getLocalDateKey());

    act(() => {
      harness.value.deleteQuest(createdQuest.id);
    });

    expect(
      harness.value.quests.some((quest) => quest.id === createdQuest.id),
    ).toBe(false);

    harness.unmount();
  });

  it("persists quest changes and restores them after remounting", () => {
    const harness = renderUseQuests();

    act(() => {
      harness.value.addQuest({
        name: "Stretch for five minutes",
        emoji: "🧘",
      });
    });

    const savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(savedState.quests).toContainEqual(
      expect.objectContaining({
        id: "quest-test-id",
        name: "Stretch for five minutes",
        emoji: "🧘",
        completionDates: [],
      }),
    );

    harness.unmount();
    const reloadedHarness = renderUseQuests();

    expect(reloadedHarness.value.quests).toEqual(savedState.quests);

    reloadedHarness.unmount();
  });
});
