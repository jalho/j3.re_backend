// external imports
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useSubscription, useApolloClient, useMutation } from "@apollo/client";

// own imports
import {
  GET_ALL_APPROVED_NOTES,
  NOTE_APPROVAL_TOGGLED,
  ADD_NOTE,
  NOTE_DELETED
} from "../../utils/graphql";
import { notify } from "../../utils/helpers";
import { Note, StateCombinedFromReducers } from "../../types";
import { clearInputNote, setInputNote } from "../../state/actionCreators";

const LeaveNote: React.FC = () => {
  const { t } = useTranslation();
  const [ serverStatusMsg, setServerStatusMsg ] = useState<string>();
  
  // cache and state management (Apollo and Redux)
  const client = useApolloClient();
  const dispatch = useDispatch();

  // GraphQL operations
  const [ getAllApprovedNotes, { data, loading, error } ] = useLazyQuery(GET_ALL_APPROVED_NOTES);
  const [ addNote ] = useMutation(ADD_NOTE);

  const inputs = useSelector((state: StateCombinedFromReducers) => {
    return state.inputReducer.inputs;
  });
  const authentication = useSelector((state: StateCombinedFromReducers) => {
    return state.authenticationReducer.authentication;
  });

  /**
   * Get updated approved notes cache.
   * @param note received in subscription data containing ID and approval status
   */
  const getUpdatedApprovedNotesCache = (note: Note): Array<Note> => {
    let oldCache = client.readQuery({ query: GET_ALL_APPROVED_NOTES });
    oldCache = oldCache.approvedNotes;
    // keep other notes
    const updatedCache: Array<Note> = oldCache ? oldCache.filter((n: Note) => n.id !== note.id) : new Array<Note>();
    // add updated note if it's approved
    if (note.approved) {
      updatedCache.push(note);
    }
    return updatedCache;
  };

  /**
   * Attempt sending note to backend and notify UI accordingly.
   * @param event submitting form data
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addNote({ variables: { content: inputs.newNote } })
      .then(() => notify(t("Note submitted for manual approval.")))
      .catch(() => notify(t("Submission failed."), 5000, "danger"));
    dispatch(clearInputNote()); // clear field at the end
  };

  /**
   * Update input field's value to app's state in Redux store.
   * @param event changing input element's value
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    if (event.target.value.length === 0) dispatch(clearInputNote());
    else dispatch(setInputNote(event.target.value));
  };

  /* indicate server status in case loading takes longer than given time
  (Heroku Free sleeps after 30 minutes of inactivity) */
  useEffect(
    () => {
      if (error) setServerStatusMsg(t("Server is not operational."));
      const timerID = setTimeout(
        () => {
          if (loading) setServerStatusMsg(t("The server seems to be sleeping. Wait a moment, waking it up..."));
        }, 1000
      );
      return (): void => clearTimeout(timerID);
    }, [loading, t, error]
  );

  // query all approved notes on mount
  useEffect(() => {
    getAllApprovedNotes();
  }, [getAllApprovedNotes]);

  // update cache when some note's approval status changes
  useSubscription(NOTE_APPROVAL_TOGGLED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedNote = subscriptionData.data.noteApprovalChanged;
      client.writeQuery({
        query: GET_ALL_APPROVED_NOTES,
        data: {
          approvedNotes: getUpdatedApprovedNotesCache(updatedNote)
        }
      });
    }
  });

  // remove note from UI's approved notes if it was deleted elsewhere
  useSubscription(NOTE_DELETED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const cachedNotesQuery = client.readQuery({ query: GET_ALL_APPROVED_NOTES });
      const oldNotes: Array<Note> = cachedNotesQuery.approvedNotes;
      const deletedNoteID = subscriptionData.data.noteDeleted;
      client.writeQuery({
        query: GET_ALL_APPROVED_NOTES,
        data: {
          approvedNotes: oldNotes ? oldNotes.filter(n => n.id !== deletedNoteID) : new Array<Note>()
        }
      });
    }
  });

  // create JSX elements of fetched notes
  let noteElements: Array<JSX.Element> = [];
  if (data && data.approvedNotes) noteElements = data.approvedNotes.map((note: Note) => (
    <div key={note.id} className="note">
      <p>
        <b>{`${new Date(note.time).getUTCDate()}.${new Date(note.time).getUTCMonth()+1}.${new Date(note.time).getUTCFullYear()}`}</b>
        <br/>
        <i>{note.content}</i>
      </p>
    </div>
  ));

  return (
    <div id="leaveNote">
      {
        !authentication // submission form available only for logged in users
          ?
            <>
              <p>{t("Note leaving is only allowed for logged in users.")}</p>
            </>
          :
            <>
              <p>{t("Leave a note for manual review before publication.")}</p>
              <form onSubmit={handleSubmit}>
                <input type="text" value={inputs.newNote} onChange={handleChange} />
                <input id="submitNote" type="submit" value={t("Submit") as string} />
              </form>
            </>
      }
      {
        noteElements.length > 0 // show notes if there are any to show
          ?
            noteElements
          :
            <p>{serverStatusMsg}</p>
      }
    </div>
  );
};

export default LeaveNote;
