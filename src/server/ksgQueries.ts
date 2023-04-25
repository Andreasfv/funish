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
export interface KSGInternalGroupResponse {
  data: {
    internalGroup: {
      id: string;
      name: string;
      membershipData: {
        internalGroupPositionName: string;
        users: {
          id: string;
          fullName: string;
          profileImage: string;
          email: string;
        }[];
      }[];
    };
  };
}

export const KSG_NETT_HOVMESTER_QUERY = `
  query InternalGroup($id: ID!) {
    internalGroup(id: $id) {
      id
      name
      membershipData {
        internalGroupPositionName
        users {
          id
          fullName
          profileImage
          email
          __typename
        }
        __typename
      }
      __typename
    }
  } `;

export interface KSGInternalGangsResponse {
  data: {
    internalGroups: {
      id: string;
      name: string;
      type: string;
      groupIcon: string;
    }[];
  };
}

export const KSG_NETT_INTERNAL_GANGS_QUERY = `
  query allInternalGroupsByTypeQuery {
    internalGroups: allInternalGroupsByType(internalGroupType: INTERNAL_GROUP) {
      id
      name
      type
      groupIcon
      __typename
    }
  }
`;
