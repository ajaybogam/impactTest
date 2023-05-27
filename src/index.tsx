import React from "react";
import FoodRecipeTable from "./Table";
function App() {
  const [apiStatus, setAPIStatus] =
    React.useState<FoodRecipeNS.apiStatus | null>(null);
  const [apiResponse, setAPIResponse] = React.useState<
    FoodRecipeNS.IAPIResponse[]
  >([]);
  const apiEndPoint =
    "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json";

  const fetchFoodRecipeDetails = async () => {
    setAPIStatus("loading");
    try {
      const response = await fetch(apiEndPoint);
      const responseJSON = await response.json();
      setAPIStatus("success");
    } catch (error) {
      setAPIStatus("error");
    }
  };

  React.useEffect(() => {
    fetchFoodRecipeDetails();
  }, []);

  if (apiStatus === "loading") {
    return <div>Fetching</div>;
  }
  if (apiStatus === "error") {
    return <button onClick={fetchFoodRecipeDetails}>Fetch Food Recipe</button>;
  }
  return <FoodRecipeTable apiResponse={apiResponse} />;
}

export default App;
