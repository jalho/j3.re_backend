// external imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useLazyQuery, useSubscription, useApolloClient } from "@apollo/client";
import Button from "react-bootstrap/Button";

// own imports
import { StateCombinedFromReducers, Project, Note } from "../../types";
import { 
  GET_ALL_NOTES,
  TOGGLE_NOTE_APPROVAL,
  GET_ALL_APPROVED_NOTES,
  GET_ALL_PROJECTS,
  TOGGLE_PROJECT_VISIBILITY,
  NOTE_ADDED,
  DELETE_NOTE_BY_ID,
  ADD_PROJECT,
  REMOVE_PROJECT_BY_ID
} from "../../utils/graphql";
import Card from "../../components/Card";
import { notify } from "../../utils/helpers";

const ContentManagement: React.FC = () => {
  const { t } = useTranslation();
  const { authentication } = useSelector((state: StateCombinedFromReducers) => { return state.authenticationReducer; });
  const { eggClickCounter } = useSelector((state: StateCombinedFromReducers) => { return state.appModeReducer; });
  const client = useApolloClient(); // for cache operations

  // project submit form state
  const [ projectName, setProjectName ] = useState<string>();
  const [ projectCategories, setProjectCategories ] = useState<string[]>();
  const [ projectDescriptionEn, setProjectDescriptionEn ] = useState<string>();
  const [ projectDescriptionFi, setProjectDescriptionFi ] = useState<string>();
  const [ projectTechnologies, setProjectTechnologies ] = useState<string[]>();
  const [ projectRepositories, setProjectRepositories ] = useState<string[]>();
  const [ projectStartTime, setProjectStartTime ] = useState<string>();
  const [ projectVisible, setProjectVisible ] = useState<boolean>();

  // GraphQL operations
  const [ getAllNotes, { data: allNotesData } ] = useLazyQuery(GET_ALL_NOTES);
  const [ getAllProjects, { data: allProjectsData } ] = useLazyQuery(GET_ALL_PROJECTS);
  const [ mutateApproval ] = useMutation(TOGGLE_NOTE_APPROVAL);
  const [ mutateVisibility ] = useMutation(TOGGLE_PROJECT_VISIBILITY);
  const [ deleteNoteByID ] = useMutation(DELETE_NOTE_BY_ID);
  const [ addProject ] = useMutation(ADD_PROJECT);
  const [ removeProjectByID ] = useMutation(REMOVE_PROJECT_BY_ID);

  /**
   * Toggle a note's approval and refetch approved notes' query to rerender them in other views.
   */
  const toggleApproval = (noteID: string): void => {
    mutateApproval({
      variables: { id: noteID },
      refetchQueries: [{ query: GET_ALL_APPROVED_NOTES }]
    });
  };

  /**
   * Toggle a project's visibility and refetch all notes' query to rerender them in other views.
   */
  const toggleVisibility = (projectID: string): void => {
    mutateVisibility({
      variables: { id: projectID },
      refetchQueries: [{ query: GET_ALL_PROJECTS }]
    });
  };

  /**
   * Execute note deletion mutation and refetch respective queries.
   * @param noteID of the note to be deleted
   */
  const deleteNoteSingleNote = (noteID: string): void => {
    deleteNoteByID({
      variables: { id: noteID },
      refetchQueries: [{ query: GET_ALL_NOTES }, { query: GET_ALL_APPROVED_NOTES }]
    }).catch();
  };

  /**
   * Submit a new project to database.
   * @param event emitted by submitting form
   */
  const submitNewProject = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addProject({
      variables: {
        name: projectName,
        categories: projectCategories,
        description_en: projectDescriptionEn,
        description_fi: projectDescriptionFi,
        technologies: projectTechnologies,
        startTime: projectStartTime,
        repositories: projectRepositories,
        visible: projectVisible,
      }
    }).catch(error => notify(error.message, 5000, "danger")); // in case one of the required fields is left empty
  };

  /**
   * Handle the event of clicking remove project button.
   * @param id of the project to delete
   */
  const deleteProjectHandler = (id: string): void => {
    // not beautiful, but I don't want to accidentally delete the 3 actual projects I have in the database
    if (!window.confirm("Are you sure?")) return;

    removeProjectByID({
      variables: {
        id
      },
      refetchQueries: [
        { query: GET_ALL_PROJECTS }
      ]
    });
  };

  // Query all notes on mount.
  useEffect(() => {
    getAllNotes();
    getAllProjects();
  }, [getAllNotes, getAllProjects]);

  // update Apollo's cache with the new note
  useSubscription(NOTE_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      // get existing
      const cachedDataOld = client.readQuery({ query: GET_ALL_NOTES });
      const existingNotes: Array<Note> = cachedDataOld.allNotes ? cachedDataOld.allNotes : new Array<Note>();
      // add new...
      const addedNote = subscriptionData.data.noteAdded;
      // ...except if it's already added
      if (existingNotes.find(note => note.id === addedNote.id)) return;
      client.writeQuery({
        query: GET_ALL_NOTES,
        data: { allNotes: existingNotes.concat(addedNote) }
      });
    }
  });

  // non authorized view
  if (!authentication || !authentication.user.roles.includes("admin")) {
    return (
      <div id="contentManagement">
        <p>{t("Content management is only available to admins.")}</p>
      </div>
    );
  }

  // limit long note content render in content management view for compact UI
  const noteVisibleCharsCount = 50;

  // authorized view
  return (
    <div id="contentManagement" className="view">
      <div className="item">
        <Card
          infoText={t("PROJECTS_VISIBILITY")}
          items={
            !allProjectsData
              ? null
              : allProjectsData.projects.map((project: Project, idx: number) => (
                <div key={idx} className="projectItem">
                  <i>{project.name}</i>
                  <span className="visibilityText">
                    <span>{t("VISIBILITY_LABEL")}</span>
                    <code style={{ color: project.visible ? "lightgreen" : "pink" }}>
                      {project.visible.toString()}
                    </code>
                  </span>
                  <Button
                    onClick={(): void => toggleVisibility(project.id)}
                    variant={project.visible ? "secondary" : undefined}
                  >
                    {project.visible ? t("Hide") : t("Show")}
                  </Button>
                  <Button
                    onClick={(): void => deleteProjectHandler(project.id)}
                    variant="danger"
                  >
                    {t("Delete")}
                  </Button>
                </div>
            ))
          }
        />
      </div>
      <div className="item">
        <Card
          infoText={t("NOTES_APPROVAL")}
          items={
            !allNotesData || !allNotesData.allNotes
              ? null
              : allNotesData.allNotes.map((note: Note, idx: number) => (
                <div key={idx} className="noteItem">
                  <i>{note.content.substring(0, noteVisibleCharsCount) + (note.content.length > noteVisibleCharsCount ? "..." : "")}</i>
                  <span className="approvalText">
                    <span>{t("APPROVED_LABEL")}</span>
                    <code style={{ color: note.approved ? "lightgreen" : "pink" }}>
                      {note.approved.toString()}
                    </code>
                  </span>
                  <Button
                    onClick={(): void => toggleApproval(note.id)}
                    variant={note.approved ? "secondary" : undefined}
                  >
                    {note.approved ? t("Disapprove") : t("Approve")}
                  </Button>
                  <Button
                    onClick={(): void => deleteNoteSingleNote(note.id) }
                    variant="danger"
                  >
                    {t("Delete")}
                  </Button>
                </div>
          ))
          }
        />
      </div>
      {
      /* Project submission tool is quick and dirty, so it's hidden.
      It is made visible the same way as the easter egg. I'm running out
      of time to make this more elegant. */
      eggClickCounter !== 5
        ? null
        : <div className="item">
            <Card
              infoText={t("Add project to portfolio")}
              items={[
                <form key="0" onSubmit={submitNewProject}>
                  <label>
                    name: <input type="text" onChange={(event): void => setProjectName(event.target.value)}/>
                  </label>
                  <label>
                    categories: <input type="text" onChange={(event): void => setProjectCategories(new Array<string>(...event.target.value.split(",")))}/>
                  </label>
                  <label>
                    desc en: <input type="text" onChange={(event): void => setProjectDescriptionEn(event.target.value)}/>
                  </label>
                  <label>
                    desc fi: <input type="text" onChange={(event): void => setProjectDescriptionFi(event.target.value)}/>
                  </label>
                  <label>
                    techs: <input type="text" onChange={(event): void => setProjectTechnologies(new Array<string>(...event.target.value.split(",")))}/>
                  </label>
                  <label>
                    repos: <input type="text" onChange={(event): void => setProjectRepositories(new Array<string>(...event.target.value.split(",")))}/>
                  </label>
                  <label>
                    start time: <input type="text" onChange={(event): void => setProjectStartTime(event.target.value)}/>
                  </label>
                  <label>
                    visible: <input type="text" onChange={(event): void => setProjectVisible(event.target.value === "true" ? true : false)}/>
                  </label>
                  <input type="submit"/>
                </form>
              ]}
            />
          </div>
      }
    </div>
  );
};

export default ContentManagement;
