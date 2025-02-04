import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import PageLayout from '../components/PageLayout';
import MDXContainer from '../components/MDXContainer';
import GuideListing from '../components/GuideListing/GuideListing';
import GuideTile from '../components/GuideTile/GuideTile';
import styles from './OverviewTemplate.module.scss';

import DevSiteSeo from '../components/DevSiteSeo';

const OverviewTemplate = ({ data, location }) => {
  const { mdx, guides } = data;
  const { frontmatter, body } = mdx;
  const { title, description } = frontmatter;

  return (
    <>
      <DevSiteSeo title={title} description={description} location={location} />
      <PageLayout type={PageLayout.TYPE.SINGLE_COLUMN}>
        <PageLayout.Header title={title} />
        <PageLayout.Content>
          <MDXContainer>{body}</MDXContainer>
          {!!guides?.nodes.length && (
            <>
              <h2
                className={styles.subtitle}
              >{`Guides to ${title.toLowerCase()}`}</h2>
              <GuideListing className={styles.guideListing}>
                <GuideListing.List>
                  {guides?.nodes.map(({ frontmatter }, index) => (
                    <GuideTile
                      to={frontmatter.path}
                      key={index}
                      duration={frontmatter.duration}
                      title={
                        frontmatter.tileShorthand?.title || frontmatter.title
                      }
                      description={
                        frontmatter.tileShorthand?.description ||
                        frontmatter.description
                      }
                      path={frontmatter.path}
                    />
                  ))}
                </GuideListing.List>
              </GuideListing>
            </>
          )}
        </PageLayout.Content>
      </PageLayout>
    </>
  );
};

OverviewTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object.isRequired,
};

export const pageQuery = graphql`
  query($path: String!, $guidesFilter: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      body
      frontmatter {
        path
        title
        description
      }
    }
    guides: allMdx(
      filter: {
        frontmatter: {
          template: { eq: "GuideTemplate" }
          path: { glob: $guidesFilter }
        }
      }
    ) {
      nodes {
        frontmatter {
          path
          title
          description
          duration
          tileShorthand {
            title
            description
          }
        }
      }
    }
  }
`;

export default OverviewTemplate;
