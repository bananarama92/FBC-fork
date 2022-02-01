/** @public */
export declare interface ModSDKGlobalAPI {
  version: string;
  registerMod(
    name: string,
    version: string,
    allowReplace?: boolean
  ): ModSDKModAPI;
  getModsInfo(): ModSDKModInfo[];
  getPatchingInfo(): Map<string, PatchedFunctionInfo>;
}

/** @public */
export declare interface ModSDKModAPI {
  unload(): void;
  hookFunction(
    functionName: string,
    priority: number,
    hook: PatchHook
  ): () => void;
  patchFunction(
    functionName: string,
    patches: Record<string, string | null>
  ): void;
  removePatches(functionName: string): void;
  callOriginal(
    functionName: string,
    args: unknown[],
    context?: unknown
  ): unknown;
  getOriginalHash(functionName: string): string;
}

/** @public */
export declare interface ModSDKModInfo {
  name: string;
  version: string;
}

/** @public */
export declare interface PatchedFunctionInfo {
  name: string;
  originalHash: string;
  hookedByMods: string[];
  patchedByMods: string[];
}

/** @public */
export declare type PatchHook = (
  args: unknown[],
  next: (modifiedArgs: unknown[]) => unknown
) => unknown;

export {};
