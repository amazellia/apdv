import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import NavBar from '../src/components/nav'
import {getPosts} from "../src/api/ghostCMS"
import { useState } from 'react'
import type { PostType } from '../src/api/ghostCMS'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArchive} from'@fortawesome/free-solid-svg-icons'
import postCards from '../src/components/postCards'
import Link from 'next/link'
import NProgress from 'nprogress'; //nprogress module

var blog = "tag: blog"
export const getStaticProps = async () => {
    const data = await getPosts(blog)
	const initialPosts = data.posts
	const totalPages = data.pages

    if (!data) {return {notFound: true,}}
    return {props: { initialPosts, totalPages}, revalidate: 10}
}

const Blog: React.FC<{initialPosts: PostType[], totalPages: number}> = (props) => {
	const {initialPosts, totalPages} = props
    const [posts, setPosts] = useState<PostType[] | null>(initialPosts);
	const [page, setPage] = useState(1);
	//const [filter, setFilter] = React.useState('')
	
	const pagginationHandler = (event, value) => {
		NProgress.start();
		setPage(value);
		getPosts(blog, value).then(res=>{
			setPosts(res.posts);
			NProgress.done();
		}).catch(err=>console.log(err));
		window.scrollTo({top: 0, behavior: 'smooth'})
    };
	
	// ⌛ TO-DO: retain page history when going back from post slug
	return (
		<div>
			<Head>
				<title>amanda viray | blog</title>
				<meta charSet='utf-8' name='description' content="Amanda's blog by midnight"/>
			</Head>

			<NavBar/>

			<div className={styles.container}>
				<h1>✏️ <span className='gradient'>blog</span></h1>

				<p>in the depths of my mind</p>

				 {posts && postCards(posts, page, totalPages, pagginationHandler)}
				<Link href="/archives">
					<button className={styles.seeMoreButton}>
						<FontAwesomeIcon icon={faArchive}/> archives
					</button>
				</Link>

				<footer>Amanda Patricia Dorado Viray © 2022 <br/>Made with 💖 + Next.js</footer>

			</div>
		</div>
	);
};
export default Blog