import { getGithubProject } from "@/app/services/githubProject.service";

global.fetch = jest.fn();

describe("Github Project Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("getGithubProject", () => {
    const mockData = {
      id: "123",
      name: "test-repo",
      html_url: "https://github.com/test/test-repo",
      description: "Test repository",
    };

    it("should fetch github project successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getGithubProject("testuser", "test-repo");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/testuser/test-repo"
      );
      expect(result).toEqual(mockData);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Request failed");
      (global.fetch as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      expect.assertions(1);

      try {
        await getGithubProject("testuser", "test-repo");
        fail("Should have thrown an error");
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe("Request failed");
        }
      }
    });
  });
});
