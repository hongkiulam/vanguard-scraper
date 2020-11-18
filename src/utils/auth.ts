import expressBasicAuth from "express-basic-auth";
import axios from "axios";

export const authorizer = (
  username: string,
  password: string,
  authoriser: expressBasicAuth.AsyncAuthorizerCallback
) => {
  // authenticate against vanguard login api
  axios
    .post(
      "https://secure.vanguardinvestor.co.uk/en-GB/Api/Session/Login/Post",
      { request: { username, password } }
    )
    .then((response) => {
      const loginResponse = response.data;
      if (loginResponse?.Result.NavigateTo === null) {
        return authoriser(null, false);
      } else {
        return authoriser(null, true);
      }
    });
};
