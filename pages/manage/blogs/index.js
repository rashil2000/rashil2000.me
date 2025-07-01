import React from 'react'

import { EntityTypes } from '../../../lib/commonUtils'
import AuthBlock from '../../../components/AuthBlock'
import EntityManager from '../../../components/EntityManager'

export default function ManageBlogs() {
  return (
    <AuthBlock>
      <EntityManager entityType={EntityTypes.Blog} />
    </AuthBlock>
  );
}
