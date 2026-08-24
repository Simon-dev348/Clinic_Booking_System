import { WorkspacePage } from "../../components/WorkspacePage";

export default function PatientsPage() {
  return (
    <WorkspacePage
      eyebrow="Workspace"
      title="Patients"
      copy="Keep patient relationships organized and ready for the next appointment."
      items={["Patient records", "Upcoming appointments", "Communications"]}
    />
  );
}
