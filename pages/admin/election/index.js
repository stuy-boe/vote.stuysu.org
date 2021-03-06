import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import { gql, useQuery } from "@apollo/client";
import withApollo from "../../../comps/apollo/withApollo";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Link from "next/link";

import ElectionCardGrid from "../../../comps/election/ElectionCardGrid";
import { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Search from "@material-ui/icons/Search";
import { useRouter } from "next/router";

const ELECTIONS_QUERY = gql`
  query (
    $query: String!
    $openElectionsPage: PositiveInt!
    $pastElectionsPage: PositiveInt!
  ) {
    openElections(query: $query, page: $openElectionsPage) {
      page
      numPages
      total
      results {
        id
        name
        url
        start
        end
        picture {
          id
          resource {
            id
            url
            width
            height
          }
          alt
        }
      }
    }

    pastElections(query: $query, page: $pastElectionsPage) {
      page
      numPages
      total
      results {
        id
        name
        start
        url
        end
        picture {
          id
          resource {
            id
            url
            width
            height
          }
          alt
        }
      }
    }
  }
`;

const AdminElections = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.q || "");
  const [openElectionsPage, setOpenElectionsPage] = useState(1);
  const [pastElectionsPage, setPastElectionsPage] = useState(1);
  const { data, loading } = useQuery(ELECTIONS_QUERY, {
    variables: { openElectionsPage, pastElectionsPage, query },
  });

  const openElections = data?.openElections;
  const pastElections = data?.pastElections;

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>Elections | Admin Panel</Typography>
          <AdminTabBar />

          <Link href={"/admin/election/create"}>
            <Button
              startIcon={<Add />}
              variant={"outlined"}
              color={"secondary"}
            >
              Create Election
            </Button>
          </Link>

          <TextField
            label={"Search Elections"}
            value={query}
            variant={"outlined"}
            color={"primary"}
            InputProps={{
              endAdornment: <Search />,
            }}
            className={layout.spaced}
            onChange={(ev) => {
              setQuery(ev.target.value);
              router.push(router.pathname, { query: { q: ev.target.value } });
            }}
          />

          {loading && <CircularProgress />}
          {!loading && (
            <>
              <Typography variant={"h2"}>Open Elections</Typography>
              <ElectionCardGrid
                numPages={openElections?.numPages}
                page={openElections?.page}
                results={openElections?.results}
                onPageChange={(ev, page) => setOpenElectionsPage(page)}
                admin
              />
              <Typography variant={"h2"}>Past Elections</Typography>
              <ElectionCardGrid
                numPages={pastElections?.numPages}
                page={pastElections?.page}
                results={pastElections?.results}
                onPageChange={(ev, page) => setPastElectionsPage(page)}
                admin
              />
            </>
          )}
        </main>
      </div>
    </AdminRequired>
  );
};

export default withApollo({ ssr: false })(AdminElections);
