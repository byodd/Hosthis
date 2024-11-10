export interface Project {
  hosting_id: string;
  project_url: string;
  build_command: string;
  launch_command: string;
  install_command: string;
  created_at: string;
  user_id: string;
  status: boolean;
}

export interface GithubProject {
  id: string;
  html_url: string;
  name: string;
}
