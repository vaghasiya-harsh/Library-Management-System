import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Book Details</h1>

      <p>Book ID: {id}</p>
    </div>
  );
};

export default BookDetails;
