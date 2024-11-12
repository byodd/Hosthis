import axios from "axios";
import {
  createProject,
  getHostedProjects,
  getProjectStatus } from "../../src/app/services/project.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Project Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProject", () => {
    const projectData = {
      projectUrl: "https://github.com/test/project",
      installCommand: "npm install",
      buildCommand: "npm run build",
      launchCommand: "npm start",
      userEmail: "test@example.com",
    };

    it("should create a project successfully", async () => {
      mockedAxios.post.mockResolvedValue({ data: { id: "123" } });

      const result = await createProject(
        projectData.projectUrl,
        projectData.installCommand,
        projectData.buildCommand,
        projectData.launchCommand,
        projectData.userEmail
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/commands",
        projectData
      );
      expect(result?.data).toEqual({ id: "123" });
    });

    it("should handle creation error", async () => {
      const error = new Error("Creation failed");
      mockedAxios.post.mockRejectedValue(error);
      console.error = jest.fn();

      await createProject(
        projectData.projectUrl,
        projectData.installCommand,
        projectData.buildCommand,
        projectData.launchCommand,
        projectData.userEmail
      );

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getHostedProjects", () => {
    it("should fetch hosted projects successfully", async () => {
      const mockProjects = [{ id: "123", name: "test" }];
      mockedAxios.get.mockResolvedValue({ data: mockProjects });

      const result = await getHostedProjects("test@example.com");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/projects/test@example.com"
      );
      expect(result).toEqual(mockProjects);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Fetch failed");
      mockedAxios.get.mockRejectedValue(error);
      console.error = jest.fn();

      await getHostedProjects("test@example.com");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getProjectStatus", () => {
    it("should fetch project status successfully", async () => {
      const mockStatus = { status: "running" };
      mockedAxios.get.mockResolvedValue({ data: mockStatus });

      const result = await getProjectStatus("123");

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/commands/123/status");
      expect(result).toEqual(mockStatus);
    });
  });
});
