import API from "../api/Api";

export default function JobCard({ job }) {
  const apply = async () => {
    await API.post(`/applications/${job.id}`);
    alert("Applied!");
  };

  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <h2 className="font-bold">{job.title}</h2>
      <p>{job.description}</p>
      <button
        onClick={apply}
        className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
}