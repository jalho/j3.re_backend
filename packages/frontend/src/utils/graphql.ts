import { gql } from "@apollo/client";

export const GET_ALL_APPROVED_NOTES = gql`
  query ApprovedNotes {
    approvedNotes {
      id
      content
      time
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        id
        roles
      }
    }
  }
`;

export const TOGGLE_NOTE_APPROVAL = gql`
  mutation ToggleNoteApproval($id: String!) {
    toggleNoteApproval(id: $id) {
      id
      content
      time
      approved
    }
  }
`;

export const TOGGLE_PROJECT_VISIBILITY = gql`
  mutation ToggleProjectVisibility($id: String!) {
    toggleProjectVisibility(id: $id) {
      id
      visible
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query Projects {
    projects {
      id
      name
      categories
      description {
        en
        fi
      }
      technologies
      startTime
      repositories
      visible
    }
  }
`;

export const GET_MY_IP = gql`
  query MyIP {
    myIP {
      ip
      city
      isp
      mobile
      proxy
      flagURL
    }
  }
`;

export const GET_ALL_NOTES = gql`
  query AllNotes {
    allNotes {
      id
      content
      time
      approved
    }
  }
`;

export const NOTE_APPROVAL_TOGGLED = gql`
  subscription {
    noteApprovalChanged {
      id
      content
      time
      approved
    }
  }
`;

export const ADD_NOTE = gql`
  mutation AddNote($content: String!) {
    addNote(content: $content) {
      id
      content
      time
    }
  }
`;

export const PROJECT_VISIBILITY_CHANGED = gql`
  subscription {
    projectVisibilityChanged {
      id
      visible
    }
  }
`;

export const NOTE_ADDED = gql`
  subscription {
    noteAdded {
      id
      content
      time
      approved
    }
  }
`;

export const DELETE_NOTE_BY_ID = gql`
  mutation RemoveNoteByID($id: String!) {
    removeNoteByID(id: $id)
  }
`;

export const NOTE_DELETED = gql`
  subscription {
    noteDeleted
  }
`;

export const PROJECT_ADDED = gql`
  subscription {
    projectAdded {
      id
      name
      categories
      description {
        en
        fi
      }
      technologies
      startTime
      repositories
      visible
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!
    $categories: [String]
    $description_en: String
    $description_fi: String
    $technologies: [String]
    $startTime: String
    $repositories: [String]
    $visible: Boolean!
  ) {
    addProject(
      name: $name
      categories: $categories
      description_en: $description_en
      description_fi: $description_fi
      technologies: $technologies
      startTime: $startTime
      repositories: $repositories
      visible: $visible
    ) {
      id
      name
      categories
      description {
        en
        fi
      }
      technologies
      startTime
      repositories
      visible
    }
  }
`;

export const REMOVE_PROJECT_BY_ID = gql`
  mutation RemoveProjectByID($id: String!) {
    removeProjectByID(id: $id)
  }
`;
