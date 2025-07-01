import React from 'react'
import { EntityTypes } from '../../../lib/commonUtils'
import EntityEditor from '../../../components/EntityEditor'
import AuthBlock from "../../../components/AuthBlock";

export default function EditBlog() {
  return (
      <AuthBlock>
        <EntityEditor entityType={EntityTypes.Blog} />
      </AuthBlock>
  );
}

