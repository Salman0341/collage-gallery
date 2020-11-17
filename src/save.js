/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

function save(props) {
	const { images, column } = props.attributes;
	return (
		<figure className="wp-collage-gallery">
			<ul className={`blocks-collage-grid column_${column}`}>
				{images.map((image, idx) => {
					const { url } = image;
					return (
						<li key={idx} className="blocks-collage-item">
							<img src={url} />
						</li>
					);
				})}
			</ul>
		</figure>
	);
}

export default save;
