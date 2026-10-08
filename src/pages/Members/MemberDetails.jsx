import { useParams } from "react-router-dom";

const MemberDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Member Details</h1>

      <p>Member Id: {id}</p>
    </div>
  );
};

export default MemberDetails;
