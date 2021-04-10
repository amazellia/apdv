import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'


const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
	title: string
	slug: string

}

async function getPosts() {
	// curl ""
	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug`
	).then((res) => res.json())

	const posts = res.posts

	return posts
}

export const getStaticProps = async ({ params }) => {
	const posts = await getPosts()
	return {
		revalidate: 10,
		props: { posts }
	}
}

const Home: React.FC<{ posts: Post[] }> = (props) => {
	const { posts } = props

	return (
		<div className={styles.container}>
        
			<Head>
				<title>blog</title>
			</Head>
			
			<div className="topnav">
				<Link href="/">
					<a>home</a>
				</Link>
				<Link href="/works">
					<a>works</a>
				</Link>
				<Link href="/blog">
					<a className="active">blog</a>
				</Link>
				<Link href="/about">
					<a>about</a>
				</Link>
			</div>

			<h1>blog</h1>

			<p>where content matters</p>

			<ul>
				{posts.map((post, index) => {
					return (
						<li className={styles.postitem} key={post.slug}>
							<Link href="/post/[slug]" as={`/post/${post.slug}`}>
								<a>{post.title}</a>
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Home