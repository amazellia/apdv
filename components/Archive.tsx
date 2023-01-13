import Tags from "./Tags";
import {getArchivesOverview } from "../pages/api/storyblok";
import { useQuery } from "@apollo/client";
import ArchivesDates from "./ArchivesDates";
import Header from './Header';

const Archive = ({blok} :any) => {
  const {data, error, loading} = useQuery(getArchivesOverview);
  if (error) return <div>errors</div>;
  return (
    <>
    {(loading || !data) ? <div className="loading"><div className="lds-heart"><div></div></div></div> :
    <>
      <Header name="amanda viray | archive"/>
      <h1>🗂️ <span className='gradient'>Archive</span></h1>
      <h2>Tags</h2>
      <Tags data={data?.TagsItems?.items[0]}/>

      <h2>Dates</h2>
      <ArchivesDates data={data}/>
      </>}
  </>
  )
};

export default Archive;