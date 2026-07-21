import { create } from "zustand";
import type {
  Block,
  BlockProps,
  BlockType,
  Experience,
  Page,
} from "@/types/experience";
import { createBlock, nid } from "@/lib/experiences/factory";

interface EditorState {
  experience: Experience | null;
  activePageId: string | null;
  selectedBlockId: string | null;
  dirty: boolean;
  saving: boolean;

  load: (exp: Experience) => void;
  setSaving: (v: boolean) => void;
  markSaved: () => void;

  patchExperience: (patch: Partial<Experience>) => void;

  setActivePage: (pageId: string) => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  setPageBackground: (pageId: string, background: string) => void;
  reorderPages: (pages: Page[]) => void;

  selectBlock: (id: string | null) => void;
  addBlock: (type: BlockType) => void;
  updateBlockProps: (blockId: string, props: Partial<BlockProps>) => void;
  updateBlockAnimation: (
    blockId: string,
    animation: Partial<Block["animation"]>,
  ) => void;
  removeBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (pageId: string, blocks: Block[]) => void;
}

function activePage(state: EditorState): Page | undefined {
  return state.experience?.pages.find((p) => p.id === state.activePageId);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  experience: null,
  activePageId: null,
  selectedBlockId: null,
  dirty: false,
  saving: false,

  load: (exp) =>
    set({
      experience: exp,
      activePageId: exp.pages[0]?.id ?? null,
      selectedBlockId: null,
      dirty: false,
    }),

  setSaving: (v) => set({ saving: v }),
  markSaved: () => set({ dirty: false, saving: false }),

  patchExperience: (patch) =>
    set((s) =>
      s.experience
        ? { experience: { ...s.experience, ...patch }, dirty: true }
        : s,
    ),

  setActivePage: (pageId) => set({ activePageId: pageId, selectedBlockId: null }),

  addPage: () =>
    set((s) => {
      if (!s.experience) return s;
      const page: Page = {
        id: nid("p_"),
        name: `Page ${s.experience.pages.length + 1}`,
        background: "transparent",
        blocks: [],
      };
      return {
        experience: {
          ...s.experience,
          pages: [...s.experience.pages, page],
        },
        activePageId: page.id,
        selectedBlockId: null,
        dirty: true,
      };
    }),

  removePage: (pageId) =>
    set((s) => {
      if (!s.experience || s.experience.pages.length <= 1) return s;
      const pages = s.experience.pages.filter((p) => p.id !== pageId);
      return {
        experience: { ...s.experience, pages },
        activePageId:
          s.activePageId === pageId ? pages[0]?.id ?? null : s.activePageId,
        selectedBlockId: null,
        dirty: true,
      };
    }),

  renamePage: (pageId, name) =>
    set((s) =>
      s.experience
        ? {
            experience: {
              ...s.experience,
              pages: s.experience.pages.map((p) =>
                p.id === pageId ? { ...p, name } : p,
              ),
            },
            dirty: true,
          }
        : s,
    ),

  setPageBackground: (pageId, background) =>
    set((s) =>
      s.experience
        ? {
            experience: {
              ...s.experience,
              pages: s.experience.pages.map((p) =>
                p.id === pageId ? { ...p, background } : p,
              ),
            },
            dirty: true,
          }
        : s,
    ),

  reorderPages: (pages) =>
    set((s) =>
      s.experience ? { experience: { ...s.experience, pages }, dirty: true } : s,
    ),

  selectBlock: (id) => set({ selectedBlockId: id }),

  addBlock: (type) =>
    set((s) => {
      const page = activePage(s);
      if (!s.experience || !page) return s;
      const block = createBlock(type);
      const pages = s.experience.pages.map((p) =>
        p.id === page.id ? { ...p, blocks: [...p.blocks, block] } : p,
      );
      return {
        experience: { ...s.experience, pages },
        selectedBlockId: block.id,
        dirty: true,
      };
    }),

  updateBlockProps: (blockId, props) =>
    set((s) => {
      if (!s.experience) return s;
      const pages = s.experience.pages.map((p) => ({
        ...p,
        blocks: p.blocks.map((b) =>
          b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b,
        ),
      }));
      return { experience: { ...s.experience, pages }, dirty: true };
    }),

  updateBlockAnimation: (blockId, animation) =>
    set((s) => {
      if (!s.experience) return s;
      const pages = s.experience.pages.map((p) => ({
        ...p,
        blocks: p.blocks.map((b) =>
          b.id === blockId
            ? { ...b, animation: { ...b.animation, ...animation } }
            : b,
        ),
      }));
      return { experience: { ...s.experience, pages }, dirty: true };
    }),

  removeBlock: (blockId) =>
    set((s) => {
      if (!s.experience) return s;
      const pages = s.experience.pages.map((p) => ({
        ...p,
        blocks: p.blocks.filter((b) => b.id !== blockId),
      }));
      return {
        experience: { ...s.experience, pages },
        selectedBlockId:
          s.selectedBlockId === blockId ? null : s.selectedBlockId,
        dirty: true,
      };
    }),

  duplicateBlock: (blockId) =>
    set((s) => {
      if (!s.experience) return s;
      const pages = s.experience.pages.map((p) => {
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return p;
        const clone: Block = {
          ...JSON.parse(JSON.stringify(p.blocks[idx])),
          id: nid("b_"),
        };
        const blocks = [...p.blocks];
        blocks.splice(idx + 1, 0, clone);
        return { ...p, blocks };
      });
      return { experience: { ...s.experience, pages }, dirty: true };
    }),

  reorderBlocks: (pageId, blocks) =>
    set((s) =>
      s.experience
        ? {
            experience: {
              ...s.experience,
              pages: s.experience.pages.map((p) =>
                p.id === pageId ? { ...p, blocks } : p,
              ),
            },
            dirty: true,
          }
        : s,
    ),
}));
