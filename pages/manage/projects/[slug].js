import React from 'react'
import { EntityTypes } from '../../../lib/commonUtils'
import EntityEditor from '../../../components/EntityEditor'
import AuthBlock from "../../../components/AuthBlock";

export default function EditProject() {
  return (
      <AuthBlock>
        <EntityEditor entityType={EntityTypes.Project} />
      </AuthBlock>
  );
}

