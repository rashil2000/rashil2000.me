import { EntityTypes } from '../../../lib/commonUtils'
import EntityCreator from '../../../components/EntityCreator'
import AuthBlock from "../../../components/AuthBlock";

export default function CreateBlog() {
    return (
        <AuthBlock>
            <EntityCreator entityType={EntityTypes.Blog} />
        </AuthBlock>
    );
}
