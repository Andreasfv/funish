export const KSG_NETT_LOGIN_QUERY = `
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ok
            token
            user {
            id
            fullName
            }
        }
    }
`;

export interface KSGUserResponse {
  data: {
    user: {
      id: string;
      fullName: string;
      nickname: string;
      ksgStatus: string;
      email: string;
      profileImage: string;
    };
  };
}
export const KSG_NETT_USER_QUERY = `
    query User($id: ID!) {
        user(id: $id) {
            id
            fullName
            nickname
            ksgStatus
            email
            profileImage
        __typename
        }
        __typename
}
`;
