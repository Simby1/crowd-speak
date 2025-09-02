import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    const err = new Error(`REDIRECT:${path}`);
    // Simulate Next.js redirect throwing to stop execution
    // Tests can assert by catching this error
    // @ts-expect-error custom flag for test
    err.__isRedirect = true;
    throw err;
  }),
}));

// Mock server supabase client
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: vi.fn(),
}));

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { deletePollAction } from "@/app/polls/page";

describe("deletePollAction", () => {
  const makeFormData = (pollId: string) => {
    const fd = new FormData();
    fd.set("poll_id", pollId);
    return fd;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when user is not authenticated", async () => {
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as any;
    (createServerSupabase as unknown as vi.Mock).mockResolvedValue(fakeSupabase);

    try {
      await deletePollAction(makeFormData("123"));
      throw new Error("Expected redirect to throw");
    } catch (e: any) {
      expect(e.message).toBe("REDIRECT:/login");
      // ensure no delete called when not logged in
      expect(fakeSupabase.from).not.toHaveBeenCalled();
    }
  });

  it("deletes poll and redirects to /polls when authenticated", async () => {
    const eqMock = vi.fn().mockReturnThis();
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ delete: deleteMock, eq: eqMock });

    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      },
      from: fromMock,
    } as any;
    (createServerSupabase as unknown as vi.Mock).mockResolvedValue(fakeSupabase);

    try {
      await deletePollAction(makeFormData("poll-1"));
      throw new Error("Expected redirect to throw");
    } catch (e: any) {
      expect(e.message).toBe("REDIRECT:/polls");
    }

    expect(fromMock).toHaveBeenCalledWith("polls");
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", "poll-1");
    expect(eqMock).toHaveBeenCalledWith("author_id", "user-1");
  });
});


