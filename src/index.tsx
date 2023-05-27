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

  const checkPreviouslyUpdatedPrice = (apiResponse: FoodRecipeNS.apiStatus) => {
    const previouProces = localStorageReturnModifiedPriceData();
    return apiResponse.map((eachItem) => {
      if (previouProces?.[eachItem.id]) {
        return {
          ...eachItem,
          price: parseInt(previouProces?.[eachItem.id].price),
        };
      } else {
        return {
          ...eachItem,
          price: parseInt(eachItem.price),
        };
      }
    });
  };
  const fetchFoodRecipeDetails = async () => {
    setAPIStatus("loading");
    try {
      const response = await fetch(apiEndPoint);
      const responseJSON = await response.json();
      setAPIResponse(responseJSON);
      setAPIStatus("success");
    } catch (error) {
      setAPIStatus("error");
    }
  };

  const handleClickOnReset = async () => {
    await localStorage.removeItem("updatedPrize");
    const api = apiResponse;
    setAPIResponse([]);
    setTimeout(() => {
      setAPIResponse(api);
    }, 200);
  };

  const localStorageReturnModifiedPriceData = () => {
    const response = localStorage.getItem("updatedPrize");
    return JSON.parse(response);
  };

  const localStorageToSetData = (data: FoodRecipeNS.IAPIResponse) => {
    const response: Record<string, FoodRecipeNS.IAPIResponse> = {
      ...localStorageReturnModifiedPriceData(),
      [data["id"]]: data,
    };
    localStorage.setItem("updatedPrize", JSON.stringify(response));
  };

  const handleClickOnSave = (data: FoodRecipeNS.IAPIResponse[]) => {
    const response: Record<string, FoodRecipeNS.IAPIResponse> = {
      ...localStorageReturnModifiedPriceData(),
    };
    data.map((eachItem) => {
      const id = eachItem["id"];
      response[id] = eachItem;
    });
    localStorage.setItem("updatedPrize", JSON.stringify(response));
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
  return (
    <FoodRecipeTable
      apiResponse={checkPreviouslyUpdatedPrice(apiResponse)}
      localStorageToSetData={localStorageToSetData}
      handleClickOnSave={handleClickOnSave}
      handleClickOnReset={handleClickOnReset}
    />
  );
}

export default App;
