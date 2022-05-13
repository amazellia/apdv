import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import NavBar from '../src/components/nav'
import { getDates, getTags } from '../src/api/ghostCMS'
import Link from 'next/link'
import moment from 'moment'

interface TagType {
    slug: string
    name: string
    description: string
    feature_image: any
}

export const getStaticProps = async () => {
    const tags = await getTags().then((res) => {return res.tags})
    const dates = await getDates().then((res)=> timelineYearSet(res.dates))
    return {props: {tags, dates}, revalidate: 10}
}

const Archive: React.FC<{tags: TagType[], dates:TimelineType[]}> = (props) => { 
    const {tags, dates} = props
    return (
        <div className={styles.subContainer}>
            <Head><title>amanda viray | archives</title></Head>
            <NavBar/>
            <h1>/archives</h1>
            <p>in the depths of my mind</p>

            <h2>Categories</h2>
            {tags && <div className={styles.gridContainer}>
                {tags?.map((t, index) => {
                    return (
                        <li className={styles.postitem} key={index}> 
                            <Link href="/archives/[archiveSlug]" as={`/archives/${t?.slug}`}>
                                <a>{t?.name}</a>								
                            </Link>
                            <p>{t?.description}</p>
                            {!!t?.feature_image && <img src={t?.feature_image} />}
                        </li>
                    );
                })} 
            </div>}

            {dates && <div>
                {dates?.map((y, index) => {
                    return ( 
                        <ul className={styles.postitem} key={index}> 
                            <li key={y.year}> <h2>
                            <Link href="/archives/[archiveSlug]" as={`/archives/${y.year}`}>
                                <a>{y.year}</a>								
                            </Link>
                            </h2></li>
                            {y.months.map( (y) => {
                                return (
                                    <li key={y}> <h3>
                                        <Link href="/archives/[archiveSlug]" as={`/archives/${y}`}>
                                        <a>{moment(y).format('MMM')}</a>								
                                        </Link>
                                    </h3> </li>
                                )
                            })}  
                        </ul>
                    )
                })} 
            </div>}
            <footer>Amanda Patricia Dorado Viray © 2022 <br/>Made with 💖 + Next.js</footer>
        </div> // End of Container
    )
} 
export default Archive

interface TimelineType { year: string; months: []}
interface DateType {created_at: string;}
function timelineYearSet(d:DateType[]) {
    const yearsList = [];
    const monthsList = [];
    var timeline = [];

    // year
    d.forEach(d => {yearsList.push(moment(d?.created_at).format('YYYY'));});
    const year = yearsList.filter((f, index, arr) => arr.indexOf(f) == index)
    yearsList.length = 0;
    year.forEach(d => {yearsList.push(d);})

    // year + months
    yearsList.forEach( function (date) {
        var formatDate = {};
        formatDate['year'] = date;
        d.forEach(d => {monthsList.push(moment(d?.created_at).format('YYYY-MM'));});
        const monthData = monthsList.filter((f) => (moment(f).format('YYYY')) == date);
        const filterMonths = monthData.filter((f, index, arr) => arr.indexOf(f) == index)
        formatDate['months'] = filterMonths.reverse(); // used to get the newest to oldest months
        timeline.push(formatDate);
    });
    return timeline;
}