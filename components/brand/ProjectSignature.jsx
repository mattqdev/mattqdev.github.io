// components/brand/ProjectSignature.jsx
// Who signs a project (brand manual §01): open-source code is Matt's,
// everything people play or install ships under MattQ Studios.
// `signature` overrides both for work done outside the studio (clients, brands).
import { StudioTile } from "./Mark";

export function isStudioProject(project) {
  return !project.isOpenSource && !project.signature;
}

export default function ProjectSignature({ project }) {
  return isStudioProject(project) ? (
    <span className="sig-studio">
      <StudioTile className="sig-tile" />
      MattQ Studios
    </span>
  ) : (
    <span className="sig-person">
      @mattqdev <span>· {project.signature || "open source"}</span>
    </span>
  );
}
