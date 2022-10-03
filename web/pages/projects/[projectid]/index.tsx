import type { NextPage } from "next";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { Notificate, Project } from "../../../common/types";
import ViewTechStack from "../../../components/Techs/ViewTechStack";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ViewTeam from "../../../components/Team/ViewTeam";
import styles from "../../../styles/ProjectPage.module.scss";
import Head from "next/head";

const ProjectPage: NextPage<Notificate> = ({ notificate }) => {
  const router = useRouter();
  const projectid = router.query.projectid;

  const [openDialog, setOpenDialog] = useState(false);

  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        if (projectid == undefined) return;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/${projectid}`
        );
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        notificate(`Error: ${err.message}`, "error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [projectid, notificate]);

  if (error) return <div>Error</div>;
  if (loading || data == undefined)
    return (
      <div
        style={{
          display: "flex",
          height: "80vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    );

  const renderImage = () => {
    if (data.image_path != undefined)
      return (
        <img
          className={styles.cover}
          alt={data.image_path}
          src={imageUrl}
          width={500}
          height={300}
        />
      );
  };

  const renderStack = () => {
    if (data.techs != undefined && data.techs != "")
      return (
        <Box>
          <h2>Technologies</h2>
          <ViewTechStack stack={data.techs} />
        </Box>
      );
  };

  const renderTeam = () => {
    if (data.students != undefined && data.students != "")
      return (
        <Box>
          <h2>Team</h2>
          <ViewTeam team={data.students} />
        </Box>
      );
  };

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/${data.image_path}`;

  return (
    <>
      <Head>
        <title>BoschView | {data.project_name}</title>
        <meta name="description" content="" />
        <link
          rel="icon"
          href="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoiYm9zY2hcL2FjY291bnRzXC9hNVwvNDAwMDA5OFwvZmF2aWNvbnNcL2M0XC8xXC80OTE5YmU5YTQ0MWFhNTdlZWY0ZWNjODJjNTNmYTY1Zi0xNTgyODAyMzk2LnBuZyJ9:bosch:IDFHfQ1b9xJR_hcNEngAKJ1pHo2gl9MFWBp2Bn45nFk?width={width}&rect=0,0,32,32&reference_width=32"
        />
      </Head>
      <Box>
        <Box className={styles.header}>
          {/* HEADER */}
          {renderImage()}
          <Box>
            <h1>{data.project_name}</h1>
            <h3>Area: {data.area}</h3>
            <h3>Start date: {data.created_date.slice(0, 10)}</h3>
            <h3>Contact: {data.contact}</h3>
            <h3>Course: {data.course}</h3>
          </Box>
          <Box className={styles.actions}>
            <Button
              className={styles.button}
              variant="contained"
              color="info"
              onClick={() => router.push(`/projects/${data.project_id}/edit`)}
            >
              Edit this page
            </Button>
            <Button
              className={styles.button}
              variant="contained"
              color="warning"
              onClick={() => setOpenDialog(true)}
            >
              Delete this page
            </Button>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>
                {"Are you sure you want to delete this project?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)} autoFocus>
                  No
                </Button>
                <Button
                  onClick={() => {
                    axios
                      .delete(
                        `${process.env.NEXT_PUBLIC_API_URL}/delete/?sl_id=${data.project_id}`
                      )
                      .then(() => router.push("/projects"));
                    setOpenDialog(false);
                  }}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>

        {/* ARTICLE */}
        <Box className={styles.article}>
          <Box className={styles.description}>
            <h2>Description</h2>
            <Box>{data.description}</Box>
          </Box>
          {renderTeam()}
          {renderStack()}
        </Box>
      </Box>
    </>
  );
};

export default ProjectPage;
