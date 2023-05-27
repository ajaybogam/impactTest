declare namespace FoodRecipeNS {
  interface IAPIResponse {
    id: number;
    name: string;
    image: string;
    category: string;
    label: string;
    price: string;
    description: string;
  }

  type apiStatus = "loading" | "error" | "success";

  interface IProps {
    apiResponse: IAPIResponse[];
  }
}
