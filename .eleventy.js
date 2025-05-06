/**
 * @fileoverview Eleventy configuration file for the Tactful Engineering Blog
 * @author Tactful Engineering Team
 * @version 1.0.0
 * 
 * This file contains configuration for the Eleventy static site generator.
 * It defines custom filters, collections, and plugins that enhance the functionality
 * of the engineering blog.
 */

const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");

/**
 * Eleventy configuration function
 * @param {Object} eleventyConfig - The Eleventy configuration API
 * @return {Object} - Configuration object with input/output directory settings
 */
module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  
  // Pass through static files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  
  /**
   * Filter items in a collection by a glob pattern
   * @param {Array} collection - The collection to filter
   * @param {string} globPattern - The glob pattern to match against input paths
   * @return {Array} - Filtered collection items matching the pattern
   */
  eleventyConfig.addFilter("filterByGlob", function(collection, globPattern) {
    if (!collection || !globPattern) return [];
    
    // Create a map of all items by their input path
    const itemsByPath = {};
    collection.forEach(item => {
      if (item.inputPath) {
        itemsByPath[item.inputPath] = item;
      }
    });
    
    // Get matching paths from all the items that match the glob pattern
    const matches = collection.filter(item => {
      return item.inputPath && item.inputPath.match(new RegExp(globPattern.replace(/\*/g, '.*')));
    });
    
    return matches;
  });
  
  /**
   * Format a date in a human-readable format
   * @param {Date} dateObj - The date object to format
   * @return {string} - Formatted date string (e.g., "01 January 2025")
   */
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
  });
  
  /**
   * Format a date in ISO format for HTML datetime attributes
   * @param {Date} dateObj - The date object to format
   * @return {string} - ISO formatted date string (e.g., "2025-01-01")
   */
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy-LL-dd");
  });
  
  /**
   * Format a date using a custom format string
   * @param {Date} date - The date object to format
   * @param {string} format - The format string (Luxon format)
   * @return {string} - Formatted date string
   */
  eleventyConfig.addFilter("date", function(date, format) {
    return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat(format || "yyyy-LL-dd");
  });
  
  /**
   * Convert a relative URL to an absolute URL
   * @param {string} url - The relative URL to convert
   * @param {string} base - The base URL to prepend
   * @return {string} - The absolute URL
   */
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    const siteMetadata = eleventyConfig.globalData?.metadata || {};
    const baseUrl = base || siteMetadata.url || "https://example.com";
    return new URL(url, baseUrl).toString();
  });
  
  /**
   * Get the first n elements of a collection
   * @param {Array} array - The array to slice
   * @param {number} n - The number of elements to take
   * @return {Array} - The first n elements of the array
   */
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    return array.slice(0, n);
  });
  
  /**
   * Get all unique tags used across a collection
   * @param {Array} collection - The collection to extract tags from
   * @return {Array} - Sorted array of unique tags
   */
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for(let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet).sort();
  });

  /**
   * Filter out common tags like "all", "post", and "posts"
   * @param {Array} tags - The array of tags to filter
   * @return {Array} - Filtered array of tags
   */
  eleventyConfig.addFilter("filterTagList", tags => {
    return (tags || []).filter(tag => ["all", "post", "posts"].indexOf(tag) === -1);
  });
  
  /**
   * Filter posts by specified tags
   * @param {Array} posts - The collection of posts to filter
   * @param {Array} tags - The tags to filter by
   * @return {Array} - Posts that contain at least one of the specified tags
   */
  eleventyConfig.addFilter("filterByTags", (posts, tags) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      return posts;
    }
    
    return posts.filter(post => {
      const postTags = post.data.tags || [];
      return tags.some(tag => postTags.includes(tag));
    });
  });

  /**
   * Find related posts based on shared tags
   * @param {Array} collection - The collection to search in
   * @param {Array} tags - The tags of the current post
   * @param {string} currentPageUrl - The URL of the current page
   * @return {Array} - Related posts sorted by the number of shared tags
   */
  eleventyConfig.addFilter("related", function(collection, tags, currentPageUrl) {
    if (!collection || !Array.isArray(collection) || !tags) {
      return [];
    }
    
    // Remove common tags like "posts"
    const filteredTags = (tags || []).filter(tag => ["all", "post", "posts"].indexOf(tag) === -1);
    
    if (filteredTags.length === 0) {
      return [];
    }
    
    // Find all posts that share at least one tag
    const relatedPosts = collection.filter(post => {
      // Skip the current post
      if (post.url === currentPageUrl) {
        return false;
      }
      
      const postTags = post.data.tags || [];
      // Check if this post has at least one common tag with the current post
      return filteredTags.some(tag => postTags.includes(tag));
    });
    
    // Sort by the number of shared tags (posts with more shared tags come first)
    relatedPosts.sort((a, b) => {
      const aSharedCount = (a.data.tags || []).filter(tag => filteredTags.includes(tag)).length;
      const bSharedCount = (b.data.tags || []).filter(tag => filteredTags.includes(tag)).length;
      return bSharedCount - aSharedCount;
    });
    
    return relatedPosts;
  });

  /**
   * Create a collection for job positions
   * @param {Object} collectionApi - The Eleventy collection API
   * @return {Array} - Collection of job positions sorted by date
   */
  eleventyConfig.addCollection("jobPositions", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/jobs/positions/*.md")
      .sort((a, b) => {
        return b.date - a.date; // Sort by date, most recent first
      });
  });

  /**
   * Create a collection for blog posts
   * @param {Object} collectionApi - The Eleventy collection API
   * @return {Array} - Collection of blog posts sorted by date
   */
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md")
      .sort((a, b) => {
        return b.date - a.date; // Sort by date, most recent first
      });
  });

  // Customize Markdown library and settings
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor);
  
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Enable automatic use of syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};

