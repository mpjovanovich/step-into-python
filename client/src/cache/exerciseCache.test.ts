import { createExerciseCache } from "@/cache/exerciseCache";
import { type ExerciseService } from "@/services/exerciseService";
import type { Exercise } from "@/types/Exercise";
import { describe, expect, it } from "vitest";

class StorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
  get length(): number {
    return Object.keys(this.store).length;
  }
  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

const exampleExercises: Exercise[] = [
  createExampleExercise("1", "Test1"),
  createExampleExercise("2", "Test2"),
];

function createExampleExercise(id: string, title: string): Exercise {
  return {
    id,
    title,
    order: 1,
    course: "",
    descriptions: {},
    instructions: {},
    template: [],
  };
}

function createExerciseServiceStub(exercises: Exercise[]): ExerciseService {
  return {
    fetchById: async (exerciseId: string) => {
      return { data: exercises.find((exercise) => exercise.id === exerciseId)!, error: null };
    },
    fetchAll: async () => {
      return { data: exercises, error: null };
    },
  };
}

describe("exercise cache", () => {
  it("should return null if the specified exercise does not exist", async () => {
    const exerciseService = createExerciseServiceStub([]);
    const exerciseCache = createExerciseCache(
      exerciseService,
      new StorageMock()
    );

    const result = await exerciseCache.fetchById("1");
    expect(result?.data).toBeNull();
  });

  it("should return the specified exercise if it exists", async () => {
    const exerciseService = createExerciseServiceStub(exampleExercises);
    const exerciseCache = createExerciseCache(
      exerciseService,
      new StorageMock()
    );

    const result = await exerciseCache.fetchById("1");
    expect(result?.data?.title).toBe("Test1");
  });

  it("should return all exercises if requested", async () => {
    const exerciseService = createExerciseServiceStub(exampleExercises);
    const exerciseCache = createExerciseCache(
      exerciseService,
      new StorageMock()
    );

    const result = await exerciseCache.fetchAll();
    expect(result?.data).toHaveLength(exampleExercises.length);
    expect(result?.data?.[0]?.title).toBe("Test1");
    expect(result?.data?.[1]?.title).toBe("Test2");
  });
});
