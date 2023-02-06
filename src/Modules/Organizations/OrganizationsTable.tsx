import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "../../utils/api";
import styled from "styled-components";

import type { SortOrganizationsInput } from "../../server/api/organizations/schema";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const OrganizationsTable: React.FC = () => {
  const [sort, setSort] = useState<SortOrganizationsInput>(undefined);
  const { data: organizationData } =
    api.organizations.getOrganizations.useQuery({
      sort: sort,
    });

  const rows = useMemo(
    () =>
      organizationData?.data?.organizations.map((organization) => (
        <tr key={organization.id}>
          <td>
            <Link
              href={`
            /organizations/${organization.id}
          `}
            >
              {organization.name}
            </Link>
          </td>
          <td>{organization.createdAt.toDateString()}</td>
          <td>{organization.updatedAt.toDateString()}</td>
        </tr>
      )),
    [organizationData]
  );
  return (
    <Wrapper>
      <ContentWrapper>
        <HeaderWrapper>
          <h1>Organizations</h1>
          <Link href="/organizations/create">Create Organization</Link>
        </HeaderWrapper>
        <table>
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => setSort(sort === "name" ? "-name" : "name")}
                >
                  Name
                </button>
              </th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </ContentWrapper>
    </Wrapper>
  );
};
