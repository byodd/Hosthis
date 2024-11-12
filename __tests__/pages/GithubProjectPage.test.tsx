// GithubProjectPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import ProjectCreation from "@/app/[userName]/[projectName]/page";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import { getGithubProject } from "@/app/services/githubProject.service";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useParams: () => ({ username: "testuser", projectName: "test-project" }),
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("../../src/app/services/githubProject.service", () => ({
  getGithubProject: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
      },
      status: "authenticated",
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockProject = {
  id: "1",
  name: "test-project",
  description: "Test project",
  html_url: "https://github.com/test/test-project",
};

const customRender = (ui: React.ReactElement) => {
  return render(
    <SessionProvider
      session={{
        user: {
          id: "1",
          username: "testuser",
          name: "Test User",
          email: "test@example.com",
        },
        expires: "1",
      }}
    >
      {ui}
    </SessionProvider>
  );
};

describe("ProjectCreation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows project form when project is fetched successfully", async () => {
    (getGithubProject as jest.Mock).mockResolvedValue(mockProject);
    customRender(<ProjectCreation />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("npm install")).toBeInTheDocument();
    });
  });

  it("shows error message when project fetch fails", async () => {
    (getGithubProject as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );
    customRender(<ProjectCreation />);

    await waitFor(() => {
      const errorMessage = screen.getByText((content) =>
        content.includes("La récupération du projet GitHub a échoué")
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
