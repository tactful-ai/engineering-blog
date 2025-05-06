/**
 * @fileoverview Job Collection Configuration for Tactful Engineering Blog
 * @author Tactful Engineering Team
 * @version 1.0.0
 * 
 * This file contains configuration for job collection in the Eleventy static site generator.
 * It defines collection for job listings that can be imported in the main .eleventy.js config.
 */

/**
 * Add job collection to Eleventy
 * This should be added to your .eleventy.js file after the filterTagList filter
 * and before the Custom Markdown library setup section
 * 
 * @param {Object} eleventyConfig - The Eleventy configuration API object
 */

// Add job collection
eleventyConfig.addCollection("job", function(collectionApi) {
  /**
   * Creates a collection of job postings from markdown files
   * @param {Object} collectionApi - The Eleventy collection API
   * @return {Array} - Collection of job positions from markdown files
   */
  return collectionApi.getFilteredByGlob("src/jobs/positions/*.md");
});