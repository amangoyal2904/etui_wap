import React from 'react'
import styles from './styles.module.scss'
// import SocialShare from "../../Utils/SocialShare";


export default function Share() {
	let path = (typeof window !== 'undefined') ? window.location.pathname : '';
	let shareParam = {
		title: "",
		url: 'https://m.economictimes.com' + path
	}
	return (
			<div className={styles.wContainer}>
				<p className={styles.wTitle}>Spread the word</p>
				<p className={styles.wSubtitle}>If you like this page, share it on:</p>
				{/* <div className={styles.iconContainer}>
					<img src="/__assets/images/fb.png" onClick={e => SocialShare.Share(e, { ...shareParam, type: "fb" })} />
					<img src="/__assets/images/twitter.png" onClick={e => SocialShare.Share(e, { ...shareParam, type: "twt" })} />
					<img src="/__assets/images/linkedin.png" onClick={e => SocialShare.Share(e, { ...shareParam, type: "lin" })} />
					<img src="/__assets/images/whatsapp_big.png" onClick={e => SocialShare.Share(e, { ...shareParam, type: "wa" })} />
				</div> */}
			</div>
	)
}
