import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Available Jobs</h1>
      {jobs.map(job => (
        <div key={job._id} style={{ border: '1px solid gray', padding: 10, margin: 10 }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><b>Location:</b> {job.location}</p>
          <Link to={`/apply/${job._id}`}>Apply</Link>
        </div>
      ))}
    </div>
  );
}
