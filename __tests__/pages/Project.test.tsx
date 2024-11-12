// Project.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Project from "@/app/project/[hostingId]/page";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";
import {
  getHostedProjects,
  getProjectStatus,
  startProject,
  stopProject,
} from "@/app/services/project.service";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useParams: () => ({ hostingId: "123" }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../src/app/services/project.service", () => ({
  getHostedProjects: jest.fn(),
  getProjectStatus: jest.fn(),
  startProject: jest.fn(),
  stopProject: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: "Test User",
        email: "test@example.com",
      },
      status: "authenticated",
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockProject = {
  hosting_id: "123",
  name: "test-project",
  status: false,
  project_url: "https://github.com/test/test-project",
  created_at: "2024-03-20T12:00:00Z",
  install_command: "npm install",
  build_command: "npm run build",
  launch_command: "npm start",
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

describe("Project Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    (getHostedProjects as jest.Mock).mockResolvedValue({ projects: [] });
    customRender(<Project />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("shows project details when project is fetched", async () => {
    (getHostedProjects as jest.Mock).mockResolvedValue({
      projects: [mockProject],
    });
    (getProjectStatus as jest.Mock).mockResolvedValue({
      status: "stopped",
    });

    customRender(<Project />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(mockProject.project_url)).toBeInTheDocument();

      expect(screen.getByText("Hors ligne")).toBeInTheDocument();

      expect(screen.getByText(mockProject.install_command)).toBeInTheDocument();
      expect(screen.getByText(mockProject.build_command)).toBeInTheDocument();
      expect(screen.getByText(mockProject.launch_command)).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });
  });

    it("shows error message when project fetch fails", async () => {
      (getHostedProjects as jest.Mock).mockRejectedValue(
        new Error("Fetch failed")
      );
      customRender(<Project />);

      await waitFor(() => {
        expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText((content) =>
            content.includes("La récupération des projets hébergés a échoué")
          )
        ).toBeInTheDocument();
      });
    });
});
