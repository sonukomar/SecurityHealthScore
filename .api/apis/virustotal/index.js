import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
    constructor() {
        this.spec = Oas.init(definition);
        this.core = new APICore(this.spec, 'virustotal/3.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config) {
        this.core.setConfig(config);
    }
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    /**
     * Get an IP address report
     *
     * @throws FetchError<400, types.IpInfoResponse400> 400
     */
    ipInfo(metadata) {
        return this.core.fetch('/ip_addresses/{ip}', 'get', metadata);
    }
    /**
     * Reanalyse an IP address already in VirusTotal
     *
     * @summary Request an IP address rescan (re-analyze)
     * @throws FetchError<400, types.RescanIpResponse400> 400
     */
    rescanIp(metadata) {
        return this.core.fetch('/ip_addresses/{id}/analyse', 'post', metadata);
    }
    /**
     * Get comments on an IP address
     *
     * @throws FetchError<400, types.IpCommentsGetResponse400> 400
     */
    ipCommentsGet(metadata) {
        return this.core.fetch('/ip_addresses/{ip}/comments', 'get', metadata);
    }
    ipCommentsPost(body, metadata) {
        return this.core.fetch('/ip_addresses/{ip}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to an IP address
     *
     * @throws FetchError<400, types.IpRelationshipsResponse400> 400
     */
    ipRelationships(metadata) {
        return this.core.fetch('/ip_addresses/{ip}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to an IP address
     *
     * @throws FetchError<400, types.IpRelationshipsIdsResponse400> 400
     */
    ipRelationshipsIds(metadata) {
        return this.core.fetch('/ip_addresses/{ip}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get votes on an IP address
     *
     * @throws FetchError<400, types.IpVotesResponse400> 400
     */
    ipVotes(metadata) {
        return this.core.fetch('/ip_addresses/{ip}/votes', 'get', metadata);
    }
    /**
     * Add a vote to an IP address
     *
     * @throws FetchError<400, types.IpVotesPostResponse400> 400
     * @throws FetchError<409, types.IpVotesPostResponse409> 409
     */
    ipVotesPost(body, metadata) {
        return this.core.fetch('/ip_addresses/{ip}/votes', 'post', body, metadata);
    }
    /**
     * Get a domain report
     *
     * @throws FetchError<400, types.DomainInfoResponse400> 400
     */
    domainInfo(metadata) {
        return this.core.fetch('/domains/{domain}', 'get', metadata);
    }
    /**
     * Reanalyse a domain already in VirusTotal
     *
     * @summary Request an domain rescan (re-analyze)
     * @throws FetchError<400, types.DomainsRescanResponse400> 400
     */
    domainsRescan(metadata) {
        return this.core.fetch('/domains/{id}/analyse', 'post', metadata);
    }
    /**
     * Get comments on a domain
     *
     * @throws FetchError<400, types.DomainsCommentsGetResponse400> 400
     */
    domainsCommentsGet(metadata) {
        return this.core.fetch('/domains/{domain}/comments', 'get', metadata);
    }
    domainsCommentsPost(body, metadata) {
        return this.core.fetch('/domains/{domain}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to a domain
     *
     * @throws FetchError<400, types.DomainsRelationshipsResponse400> 400
     */
    domainsRelationships(metadata) {
        return this.core.fetch('/domains/{domain}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a domain
     *
     * @throws FetchError<400, types.DomainsRelationshipsIdsResponse400> 400
     */
    domainsRelationshipsIds(metadata) {
        return this.core.fetch('/domains/{domain}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get a DNS resolution object
     *
     * @throws FetchError<400, types.GetResolutionByIdResponse400> 400
     */
    getResolutionById(metadata) {
        return this.core.fetch('/resolutions/{id}', 'get', metadata);
    }
    /**
     * Get votes on a domain
     *
     * @throws FetchError<400, types.DomainsVotesGetResponse400> 400
     */
    domainsVotesGet(metadata) {
        return this.core.fetch('/domains/{domain}/votes', 'get', metadata);
    }
    /**
     * Add a vote to a domain
     *
     * @throws FetchError<400, types.DomainVotesPostResponse400> 400
     * @throws FetchError<409, types.DomainVotesPostResponse409> 409
     */
    domainVotesPost(body, metadata) {
        return this.core.fetch('/domains/{domain}/votes', 'post', body, metadata);
    }
    /**
     * Get a URL for uploading files larger than 32MB
     *
     * @summary Get a URL for uploading large files
     * @throws FetchError<400, types.FilesUploadUrlResponse400> 400
     */
    filesUploadUrl(metadata) {
        return this.core.fetch('/files/upload_url', 'get', metadata);
    }
    /**
     * Retrieve information about a file
     *
     * @summary Get a file report
     * @throws FetchError<400, types.FileInfoResponse400> 400
     */
    fileInfo(metadata) {
        return this.core.fetch('/files/{id}', 'get', metadata);
    }
    /**
     * Reanalyse a file already in VirusTotal
     *
     * @summary Request a file rescan (re-analyze)
     * @throws FetchError<400, types.FilesAnalyseResponse400> 400
     */
    filesAnalyse(metadata) {
        return this.core.fetch('/files/{id}/analyse', 'post', metadata);
    }
    /**
     * Get a file’s download URL
     *
     * @throws FetchError<400, types.FilesDownloadUrlResponse400> 400
     */
    filesDownloadUrl(metadata) {
        return this.core.fetch('/files/{id}/download_url', 'get', metadata);
    }
    /**
     * Download a file
     *
     * @throws FetchError<400, types.FilesDownloadResponse400> 400
     */
    filesDownload(metadata) {
        return this.core.fetch('/files/{id}/download', 'get', metadata);
    }
    /**
     * Get comments on a file
     *
     * @throws FetchError<400, types.FilesCommentsGetResponse400> 400
     */
    filesCommentsGet(metadata) {
        return this.core.fetch('/files/{id}/comments', 'get', metadata);
    }
    /**
     * Add a comment to a file
     *
     * @throws FetchError<400, types.FilesCommentsPostResponse400> 400
     */
    filesCommentsPost(body, metadata) {
        return this.core.fetch('/files/{id}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to a file
     *
     * @throws FetchError<400, types.FilesRelationshipsResponse400> 400
     */
    filesRelationships(metadata) {
        return this.core.fetch('/files/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a file
     *
     * @throws FetchError<400, types.FilesRelationshipsIdsResponse400> 400
     */
    filesRelationshipsIds(metadata) {
        return this.core.fetch('/files/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get a crowdsourced Sigma rule object
     *
     * @throws FetchError<400, types.GetSigmaRulesResponse400> 400
     */
    getSigmaRules(metadata) {
        return this.core.fetch('/sigma_rules/{id}', 'get', metadata);
    }
    /**
     * Yara Ruleset used in our crowdsourced YARA results.
     *
     * @summary Get a crowdsourced YARA ruleset
     * @throws FetchError<400, types.GetYaraRulesetsResponse400> 400
     */
    getYaraRulesets(metadata) {
        return this.core.fetch('/yara_rulesets/{id}', 'get', metadata);
    }
    /**
     * Get votes on a file
     *
     * @throws FetchError<400, types.FilesVotesGetResponse400> 400
     */
    filesVotesGet(metadata) {
        return this.core.fetch('/files/{id}/votes', 'get', metadata);
    }
    /**
     * Add a vote on a file
     *
     * @throws FetchError<400, types.FilesVotesPostResponse400> 400
     * @throws FetchError<409, types.FilesVotesPostResponse409> 409
     */
    filesVotesPost(body, metadata) {
        return this.core.fetch('/files/{id}/votes', 'post', body, metadata);
    }
    /**
     * Get a summary of all behavior reports for a file
     *
     * @throws FetchError<400, types.FileAllBehavioursSummaryResponse400> 400
     */
    fileAllBehavioursSummary(metadata) {
        return this.core.fetch('/files/{id}/behaviour_summary', 'get', metadata);
    }
    /**
     * Get a summary of all MITRE ATT&CK techniques observed in a file
     *
     * @throws FetchError<400, types.GetASummaryOfAllMitreAttckTechniquesObservedInAFileResponse400> 400
     */
    getASummaryOfAllMitreAttckTechniquesObservedInAFile(metadata) {
        return this.core.fetch('/files/{id}/behaviour_mitre_trees', 'get', metadata);
    }
    /**
     * Get all behavior reports for a file
     *
     * @throws FetchError<400, types.GetAllBehaviorReportsForAFileResponse400> 400
     */
    getAllBehaviorReportsForAFile(metadata) {
        return this.core.fetch('/files/{id}/behaviours', 'get', metadata);
    }
    /**
     * Get a file behavior report from a sandbox
     *
     * @throws FetchError<400, types.GetFileBehaviourIdResponse400> 400
     */
    getFileBehaviourId(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}', 'get', metadata);
    }
    /**
     * Get objects related to a behaviour report
     *
     * @throws FetchError<400, types.GetFileBehavioursRelationshipResponse400> 400
     */
    getFileBehavioursRelationship(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a behaviour report
     *
     * @throws FetchError<400, types.GetFileBehavioursRelationshipDescriptorResponse400> 400
     */
    getFileBehavioursRelationshipDescriptor(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * HTML sandbox report
     *
     * @summary Get a detailed HTML behaviour report
     * @throws FetchError<400, types.GetFileBehavioursHtmlResponse400> 400
     */
    getFileBehavioursHtml(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/html', 'get', metadata);
    }
    /**
     * Get the EVTX file generated during a file’s behavior analysis
     *
     * @throws FetchError<400, types.GetFileBehavioursEvtxResponse400> 400
     */
    getFileBehavioursEvtx(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/evtx', 'get', metadata);
    }
    /**
     * Get the PCAP file generated during a file’s behavior analysis
     *
     * @throws FetchError<400, types.GetFileBehavioursPcapResponse400> 400
     */
    getFileBehavioursPcap(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/pcap', 'get', metadata);
    }
    /**
     * Get the memdump file generated during a file’s behavior analysis
     *
     * @throws FetchError<400, types.GetFileBehavioursMemdumpResponse400> 400
     */
    getFileBehavioursMemdump(metadata) {
        return this.core.fetch('/file_behaviours/{sandbox_id}/memdump', 'get', metadata);
    }
    /**
     * Get a URL report
     *
     * @throws FetchError<400, types.UrlInfoResponse400> 400
     */
    urlInfo(metadata) {
        return this.core.fetch('/urls/{id}', 'get', metadata);
    }
    /**
     * Request a URL rescan (re-analyze)
     *
     * @throws FetchError<400, types.UrlsAnalyseResponse400> 400
     */
    urlsAnalyse(metadata) {
        return this.core.fetch('/urls/{id}/analyse', 'post', metadata);
    }
    /**
     * Get comments on a URL
     *
     * @throws FetchError<400, types.UrlsCommentsGetResponse400> 400
     */
    urlsCommentsGet(metadata) {
        return this.core.fetch('/urls/{id}/comments', 'get', metadata);
    }
    /**
     * Add a comment on a URL
     *
     * @throws FetchError<400, types.UrlsCommentsPostResponse400> 400
     */
    urlsCommentsPost(body, metadata) {
        return this.core.fetch('/urls/{id}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to a URL
     *
     * @throws FetchError<400, types.UrlsRelationshipsResponse400> 400
     */
    urlsRelationships(metadata) {
        return this.core.fetch('/urls/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a URL
     *
     * @throws FetchError<400, types.UrlsRelationshipsIdsResponse400> 400
     */
    urlsRelationshipsIds(metadata) {
        return this.core.fetch('/urls/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get votes on a URL
     *
     * @throws FetchError<400, types.UrlsVotesGetResponse400> 400
     */
    urlsVotesGet(metadata) {
        return this.core.fetch('/urls/{id}/votes', 'get', metadata);
    }
    /**
     * Add a vote on a URL
     *
     * @throws FetchError<400, types.UrlsVotesPostResponse400> 400
     * @throws FetchError<409, types.UrlsVotesPostResponse409> 409
     */
    urlsVotesPost(body, metadata) {
        return this.core.fetch('/urls/{id}/votes', 'post', body, metadata);
    }
    /**
     * Get latest comments
     *
     * @throws FetchError<400, types.GetCommentsResponse400> 400
     */
    getComments(metadata) {
        return this.core.fetch('/comments', 'get', metadata);
    }
    /**
     * Get a comment object
     *
     * @throws FetchError<400, types.GetCommentResponse400> 400
     */
    getComment(metadata) {
        return this.core.fetch('/comments/{id}', 'get', metadata);
    }
    /**
     * Delete a comment
     *
     * @throws FetchError<400, types.CommentIdDeleteResponse400> 400
     */
    commentIdDelete(metadata) {
        return this.core.fetch('/comments/{id}', 'delete', metadata);
    }
    /**
     * Get objects related to a comment
     *
     */
    commentsRelationships(metadata) {
        return this.core.fetch('/comments/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a comment
     *
     * @throws FetchError<400, types.CommentsRelationshipsIdsResponse400> 400
     */
    commentsRelationshipsIds(metadata) {
        return this.core.fetch('/comments/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Add a vote to a comment
     *
     * @throws FetchError<400, types.VoteCommentResponse400> 400
     */
    voteComment(body, metadata) {
        return this.core.fetch('/comments/{id}/vote', 'post', body, metadata);
    }
    /**
     * Get a URL / file analysis
     *
     * @throws FetchError<400, types.AnalysisResponse400> 400
     */
    analysis(metadata) {
        return this.core.fetch('/analyses/{id}', 'get', metadata);
    }
    /**
     * Get objects related to an analysis
     *
     * @throws FetchError<400, types.AnalysesGetObjectsResponse400> 400
     */
    analysesGetObjects(metadata) {
        return this.core.fetch('/analyses/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to an analysis
     *
     * @throws FetchError<400, types.AnalysesGetDescriptorsResponse400> 400
     */
    analysesGetDescriptors(metadata) {
        return this.core.fetch('/analyses/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get a submission object
     *
     * @throws FetchError<400, types.GetSubmissionResponse400> 400
     */
    getSubmission(metadata) {
        return this.core.fetch('/submission/{id}', 'get', metadata);
    }
    /**
     * Get an operation object
     *
     * @throws FetchError<400, types.GetOperationsIdResponse400> 400
     */
    getOperationsId(metadata) {
        return this.core.fetch('/operations/{id}', 'get', metadata);
    }
    /**
     * Get a Whois object
     *
     * @throws FetchError<400, types.WhoisidResponse400> 400
     */
    whoisid(metadata) {
        return this.core.fetch('/whois/{id}', 'get', metadata);
    }
    /**
     * Get a SSL Certificate object
     *
     * @throws FetchError<400, types.SslCertsidResponse400> 400
     */
    ssl_certsid(metadata) {
        return this.core.fetch('/ssl_certs/{id}', 'get', metadata);
    }
    /**
     * Get an attack tactic object
     *
     * @throws FetchError<400, types.GetAttackTacticsResponse400> 400
     */
    getAttackTactics(metadata) {
        return this.core.fetch('/attack_tactics/{id}', 'get', metadata);
    }
    /**
     * Get objects related to an attack tactic
     *
     * @throws FetchError<400, types.GetAttackTacticsRelationshipResponse400> 400
     */
    getAttackTacticsRelationship(metadata) {
        return this.core.fetch('/attack_tactics/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to an attack tactic
     *
     * @throws FetchError<400, types.GetAttackTacticsRelationshipDescriptorResponse400> 400
     */
    getAttackTacticsRelationshipDescriptor(metadata) {
        return this.core.fetch('/attack_tactics/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get an attack technique object
     *
     * @throws FetchError<400, types.GetAttackTechniquesResponse400> 400
     */
    getAttackTechniques(metadata) {
        return this.core.fetch('/attack_techniques/{id}', 'get', metadata);
    }
    /**
     * Get objects related to an attack technique
     *
     * @throws FetchError<400, types.GetAttackTechniquesRelationshipResponse400> 400
     */
    getAttackTechniquesRelationship(metadata) {
        return this.core.fetch('/attack_techniques/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to an attack technique
     *
     * @throws FetchError<400, types.GetAttackTechniquesRelationshipDescriptorResponse400> 400
     */
    getAttackTechniquesRelationshipDescriptor(metadata) {
        return this.core.fetch('/attack_techniques/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get a list of popular threat categories
     *
     * @throws FetchError<400, types.GetPopularThreatCategoriesResponse400> 400
     */
    getPopularThreatCategories(metadata) {
        return this.core.fetch('/popular_threat_categories', 'get', metadata);
    }
    /**
     * Analyse code blocks with Code Insights
     *
     * @throws FetchError<400, types.AnalyseBinaryResponse400> 400
     */
    analyseBinary(body, metadata) {
        return this.core.fetch('/codeinsights/analyse-binary', 'post', body, metadata);
    }
    /**
     * List Saved Searches
     *
     * @throws FetchError<400, types.ListSavedSearchesResponse400> 400
     */
    listSavedSearches(metadata) {
        return this.core.fetch('/saved_searches', 'get', metadata);
    }
    /**
     * Create a Saved Search
     *
     * @throws FetchError<400, types.CreateSavedSearchesResponse400> 400
     */
    createSavedSearches(body, metadata) {
        return this.core.fetch('/saved_searches', 'post', body, metadata);
    }
    /**
     * Get a Saved Search
     *
     * @throws FetchError<400, types.GetSavedSearchesResponse400> 400
     */
    getSavedSearches(metadata) {
        return this.core.fetch('/saved_searches/{id}', 'get', metadata);
    }
    /**
     * Update a Saved Search
     *
     * @throws FetchError<400, types.UpdateSavedSearchesResponse400> 400
     */
    updateSavedSearches(body, metadata) {
        return this.core.fetch('/saved_searches/{id}', 'patch', body, metadata);
    }
    /**
     * Delete a Saved Search
     *
     * @throws FetchError<400, types.DeleteSavedSearchesResponse400> 400
     */
    deleteSavedSearches(metadata) {
        return this.core.fetch('/saved_searches/{id}', 'delete', metadata);
    }
    /**
     * Share a Saved Search
     *
     * @throws FetchError<400, types.ShareSavedSearchesResponse400> 400
     */
    shareSavedSearches(body, metadata) {
        return this.core.fetch('/saved_searches/{id}/relationship/{access}', 'post', body, metadata);
    }
    /**
     * Revoke access to a Saved Search
     *
     * @throws FetchError<400, types.RevokeSavedSearchesAccessResponse400> 400
     */
    revokeSavedSearchesAccess(body, metadata) {
        return this.core.fetch('/saved_searches/{id}/relationship/{access}', 'delete', body, metadata);
    }
    /**
     * Get object descriptors related to a Saved Search
     *
     * @throws FetchError<400, types.GetSavedSearchesRelatedDescriptorsResponse400> 400
     */
    getSavedSearchesRelatedDescriptors(metadata) {
        return this.core.fetch('/saved_searches/{id}/relationship/{relationship}', 'get', metadata);
    }
    /**
     * Get objects related to a Saved Search
     *
     * @throws FetchError<400, types.GetSavedSearchesRelationshipsResponse400> 400
     */
    getSavedSearchesRelationships(metadata) {
        return this.core.fetch('/saved_searches/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Search for files, URLs, domains, IPs and comments
     *
     * @throws FetchError<400, types.ApiSearchResponse400> 400
     */
    apiSearch(metadata) {
        return this.core.fetch('/search', 'get', metadata);
    }
    /**
     * Get VirusTotal metadata
     *
     * @throws FetchError<400, types.MetadataResponse400> 400
     */
    metadata(metadata) {
        return this.core.fetch('/metadata', 'get', metadata);
    }
    /**
     * Create a new collection
     *
     * @throws FetchError<400, types.CollectionsCreateResponse400> 400
     */
    collectionsCreate(body, metadata) {
        return this.core.fetch('/collections', 'post', body, metadata);
    }
    /**
     * 🔒 List collections
     *
     * @throws FetchError<400, types.ListCollectionsResponse400> 400
     */
    listCollections(metadata) {
        return this.core.fetch('/collections', 'get', metadata);
    }
    /**
     * Get a collection
     *
     * @throws FetchError<400, types.CollectionsGetResponse400> 400
     */
    collectionsGet(metadata) {
        return this.core.fetch('/collections/{id}', 'get', metadata);
    }
    /**
     * Update a collection
     *
     * @throws FetchError<400, types.CollectionsUpdateResponse400> 400
     */
    collectionsUpdate(body, metadata) {
        return this.core.fetch('/collections/{id}', 'patch', body, metadata);
    }
    /**
     * Delete a collection
     *
     * @throws FetchError<400, types.CollectionsDeleteResponse400> 400
     */
    collectionsDelete(metadata) {
        return this.core.fetch('/collections/{id}', 'delete', metadata);
    }
    /**
     * Get comments on a collection
     *
     * @throws FetchError<400, types.CollectionsCommentsResponse400> 400
     */
    collectionsComments(metadata) {
        return this.core.fetch('/collections/{id}/comments', 'get', metadata);
    }
    /**
     * Add a comment to a collection
     *
     * @throws FetchError<400, types.CollectionsCommentsCreateResponse400> 400
     */
    collectionsCommentsCreate(body, metadata) {
        return this.core.fetch('/collections/{id}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to a collection
     *
     * @throws FetchError<400, types.GetCollectionsRelationshipResponse400> 400
     */
    getCollectionsRelationship(metadata) {
        return this.core.fetch('/collections/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Add new items to a collection
     *
     * @throws FetchError<400, types.CollectionsAddElementResponse400> 400
     */
    collectionsAddElement(body, metadata) {
        return this.core.fetch('/collections/{id}/{relationship}', 'post', body, metadata);
    }
    /**
     * Delete items from a collection
     *
     * @throws FetchError<400, types.CollectionsDeleteElementResponse400> 400
     */
    collectionsDeleteElement(body, metadata) {
        return this.core.fetch('/collections/{id}/{relationship}', 'delete', body, metadata);
    }
    /**
     * Get object descriptors related to a collection
     *
     * @throws FetchError<400, types.GetCollectionsRelationshipDescriptorResponse400> 400
     */
    getCollectionsRelationshipDescriptor(metadata) {
        return this.core.fetch('/collections/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * 🔒 Export IOCs from a collection
     *
     * @throws FetchError<400, types.CollectionsExportIocsResponse400> 400
     */
    collectionsExportIocs(metadata) {
        return this.core.fetch('/collections/{id}/download/{format}', 'get', metadata);
    }
    /**
     * 🔒 Export IOCs from a given collection's relationship
     *
     * @throws FetchError<400, types.CollectionsExportIocsRelationshipResponse400> 400
     */
    collectionsExportIocsRelationship(metadata) {
        return this.core.fetch('/collections/{id}/{relationship}/download/{format}', 'get', metadata);
    }
    /**
     * 🔒 Export aggregations from a collection
     *
     * @throws FetchError<400, types.CollectionsExportAggregationsResponse400> 400
     */
    collectionsExportAggregations(metadata) {
        return this.core.fetch('/collections/{id}/aggregations/download/{format}', 'get', metadata);
    }
    /**
     * 🔒 Search IoCs inside a collection
     *
     */
    searchIocsInsideACollection(metadata) {
        return this.core.fetch('/collections/{id}/search', 'get', metadata);
    }
    /**
     * Get the subscription preferences for a collection
     *
     * @throws FetchError<400, types.GetCollectionsSubscriptionPreferencesResponse400> 400
     */
    getCollectionsSubscriptionPreferences(metadata) {
        return this.core.fetch('/collections/{id}/subscription_preferences', 'get', metadata);
    }
    /**
     * Subscribe or update your collection's subscription preferences
     *
     * @throws FetchError<400, types.UpdateCollectionsSubscriptionPreferencesResponse400> 400
     */
    updateCollectionsSubscriptionPreferences(body, metadata) {
        return this.core.fetch('/collections/{id}/subscription_preferences', 'post', body, metadata);
    }
    /**
     * List Crowdsourced YARA Rules
     *
     * @throws FetchError<400, types.ListCrowdsourcedYaraRulesResponse400> 400
     */
    listCrowdsourcedYaraRules(metadata) {
        return this.core.fetch('/yara_rules', 'get', metadata);
    }
    /**
     * Get a Crowdsourced YARA rule
     *
     * @throws FetchError<400, types.GetACrowdsourcedYaraRuleResponse400> 400
     */
    getACrowdsourcedYaraRule(metadata) {
        return this.core.fetch('/yara_rules/{id}', 'get', metadata);
    }
    /**
     * Get objects related to a Crowdsourced YARA rule
     *
     * @throws FetchError<400, types.CrowdsourcedYaraRuleRelationshipEndpointResponse400> 400
     */
    crowdsourcedYaraRuleRelationshipEndpoint(metadata) {
        return this.core.fetch('/yara_rules/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get objects descriptors related to a Crowdsourced YARA rule
     *
     * @throws FetchError<400, types.CrowdsourcedYaraRuleRelationshipDescriptorsEndpointResponse400> 400
     */
    crowdsourcedYaraRuleRelationshipDescriptorsEndpoint(metadata) {
        return this.core.fetch('/yara_rules/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get objects from the IoC Stream
     *
     * @throws FetchError<400, types.GetObjectsFromTheIocStreamResponse400> 400
     */
    getObjectsFromTheIocStream(metadata) {
        return this.core.fetch('/ioc_stream', 'get', metadata);
    }
    /**
     * Delete notifications from the IoC Stream
     *
     * @throws FetchError<429, types.DeleteNotificationsFromTheIocStreamResponse429> 429
     */
    deleteNotificationsFromTheIocStream(metadata) {
        return this.core.fetch('/ioc_stream', 'delete', metadata);
    }
    /**
     * Get an IoC Stream notification
     *
     * @throws FetchError<400, types.GetAnIocStreamNotificationResponse400> 400
     */
    getAnIocStreamNotification(metadata) {
        return this.core.fetch('/ioc_stream_notifications/{id}', 'get', metadata);
    }
    /**
     * Delete an IoC Stream notification
     *
     */
    deleteAnIocStreamNotification(metadata) {
        return this.core.fetch('/ioc_stream_notifications/{id}', 'delete', metadata);
    }
    /**
     * Check if a user or group is a Livehunt ruleset editor
     *
     */
    checkUserHuntingRulesetEditor(metadata) {
        return this.core.fetch('/intelligence/hunting_rulesets/{id}/relationships/editors/{user_or_group_id}', 'get', metadata);
    }
    /**
     * Revoke Livehunt ruleset edit permission from a user or group
     *
     */
    deleteHuntingRulesetEditor(metadata) {
        return this.core.fetch('/intelligence/hunting_rulesets/{id}/relationships/editors/{user_or_group_id}', 'delete', metadata);
    }
    /**
     * Search graphs
     *
     */
    graphs(metadata) {
        return this.core.fetch('/graphs', 'get', metadata);
    }
    createGraphs(body, metadata) {
        return this.core.fetch('/graphs', 'post', body, metadata);
    }
    /**
     * Get a graph object
     *
     */
    graphsInfo(metadata) {
        return this.core.fetch('/graphs/{id}', 'get', metadata);
    }
    graphsUpdate(body, metadata) {
        return this.core.fetch('/graphs/{id}', 'patch', body, metadata);
    }
    /**
     * Delete a graph
     *
     */
    graphsDelete(metadata) {
        return this.core.fetch('/graphs/{id}', 'delete', metadata);
    }
    /**
     * Get comments on a graph
     *
     */
    getGraphComments(metadata) {
        return this.core.fetch('/graphs/{id}/comments', 'get', metadata);
    }
    /**
     * Add a comment to a graph
     *
     */
    postGraphsComments(body, metadata) {
        return this.core.fetch('/graphs/{id}/comments', 'post', body, metadata);
    }
    /**
     * Get objects related to a graph
     *
     */
    graphsRelationships(metadata) {
        return this.core.fetch('/graphs/{id}/{relationship}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a graph
     *
     */
    graphsRelationshipsIds(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get users and groups that can view a graph
     *
     */
    graphsViewers(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/viewers', 'get', metadata);
    }
    /**
     * Grant users and groups permission to see a graph
     *
     */
    graphsAddViewer(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/viewers', 'post', metadata);
    }
    /**
     * Check if a user or group can view a graph
     *
     */
    graphsCheckViewer(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/viewers/{user_or_group_id}', 'get', metadata);
    }
    /**
     * Revoke view permission from a user or group
     *
     */
    graphsDeleteViewer(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/viewers/{user_or_group_id}', 'delete', metadata);
    }
    /**
     * Get users and groups that can edit a graph
     *
     */
    graphsEditors(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/editors', 'get', metadata);
    }
    /**
     * Grant users and groups permission to edit a graph
     *
     */
    graphsAddEditor(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/editors', 'post', metadata);
    }
    /**
     * Check if a user or group can edit a graph
     *
     */
    graphsCheckEditor(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/editors/{user_or_group_id}', 'get', metadata);
    }
    /**
     * Revoke edit graph permissions from a user or group
     *
     */
    graphsDeleteEditor(metadata) {
        return this.core.fetch('/graphs/{id}/relationships/editors/{user_or_group_id}', 'delete', metadata);
    }
    /**
     * Get a minutely domain feed batch
     *
     * @throws FetchError<400, types.Feedsdomains2TimeResponse400> 400
     */
    feedsdomains2time(metadata) {
        return this.core.fetch('/feeds/domains/{time}', 'get', metadata);
    }
    /**
     * Get a minutely IP address feed batch
     *
     * @throws FetchError<400, types.GetFeedsIpAddressesResponse400> 400
     */
    getFeedsIpAddresses(metadata) {
        return this.core.fetch('/feeds/ip_addresses/{time}', 'get', metadata);
    }
    /**
     * Get a minutely URL feed batch
     *
     * @throws FetchError<400, types.FeedsUrlResponse400> 400
     */
    feedsUrl(metadata) {
        return this.core.fetch('/feeds/urls/{time}', 'get', metadata);
    }
    /**
     * Get object descriptors related to a group
     *
     */
    groupsRelationshipsIds(metadata) {
        return this.core.fetch('/groups/{id}/relationships/{relationship}', 'get', metadata);
    }
    /**
     * Get a widget rendering URL
     *
     * @throws FetchError<400, types.WidgeturlResponse400> 400
     * @throws FetchError<429, types.WidgeturlResponse429> 429
     */
    widgeturl(metadata) {
        return this.core.fetch('/widget/url', 'get', metadata);
    }
    /**
     * Get a list of MonitorItem objects by path or tag
     *
     */
    monitorItemsFilter(metadata) {
        return this.core.fetch('/monitor/items', 'get', metadata);
    }
    /**
     * Upload a file or create a new folder
     *
     */
    monitorItemsCreate(body, metadata) {
        return this.core.fetch('/monitor/items', 'post', body, metadata);
    }
    /**
     * Get a URL for uploading files larger than 32MB
     *
     */
    monitorItemsUploadUrl(metadata) {
        return this.core.fetch('/monitor/items/upload_url', 'get', metadata);
    }
    /**
     * Get attributes and metadata for a specific MonitorItem
     *
     */
    monitorItemsStat(metadata) {
        return this.core.fetch('/monitor/items/{id}', 'get', metadata);
    }
    /**
     * Delete a VirusTotal Monitor file or folder
     *
     */
    monitorItemsDelete(metadata) {
        return this.core.fetch('/monitor/items/{id}', 'delete', metadata);
    }
    /**
     * Configure a given VirusTotal Monitor item (file or folder)
     *
     */
    monitorItemsConfig(body, metadata) {
        return this.core.fetch('/monitor/items/{id}/config', 'patch', body, metadata);
    }
    /**
     * Download a file in VirusTotal Monitor
     *
     */
    monitorItemsDownload(metadata) {
        return this.core.fetch('/monitor/items/{id}/download', 'get', metadata);
    }
    /**
     * Get a URL for downloading a file in VirusTotal Monitor
     *
     */
    monitorItemsDownloadUrl(metadata) {
        return this.core.fetch('/monitor/items/{id}/download_url', 'get', metadata);
    }
    /**
     * Get the latest file analyses
     *
     */
    monitorItemsAnalyses(metadata) {
        return this.core.fetch('/monitor/items/{id}/analyses', 'get', metadata);
    }
    /**
     * Get user owning the MonitorItem object
     *
     */
    monitorItemsOwner(metadata) {
        return this.core.fetch('/monitor/items/{id}/owner', 'get', metadata);
    }
    /**
     * Retrieve partner's comments on a file
     *
     */
    monitorItemComments(metadata) {
        return this.core.fetch('/monitor/items/{id}/comments', 'get', metadata);
    }
    /**
     * Retrieve statistics about analyses performed on your software collection
     *
     */
    monitorStatistics(metadata) {
        return this.core.fetch('/monitor/statistics', 'get', metadata);
    }
    /**
     * Retrieve historical events about your software collection
     *
     */
    events(metadata) {
        return this.core.fetch('/monitor/events', 'get', metadata);
    }
    /**
     * Get a list of MonitorHashes detected by an engine
     *
     */
    monitorpartnerHashes(metadata) {
        return this.core.fetch('/monitor_partner/hashes', 'get', metadata);
    }
    /**
     * Get a list of analyses for a file
     *
     */
    monitorpartnerHashesAnalyses(metadata) {
        return this.core.fetch('/monitor_partner/hashes/{sha256}/analyses', 'get', metadata);
    }
    /**
     * Get a list of items with a given sha256 hash
     *
     */
    monitorpartnerHashesItems(metadata) {
        return this.core.fetch('/monitor_partner/hashes/{sha256}/items', 'get', metadata);
    }
    monitorpartnerHashesComments(body, metadata) {
        return this.core.fetch('/monitor_partner/hashes/{sha256}/comments', 'post', body, metadata);
    }
    /**
     * Get comments on a sha256 hash
     *
     */
    getSha256HashComments(metadata) {
        return this.core.fetch('/monitor_partner/comments/{id}', 'get', metadata);
    }
    monitorpartnerCommentsPatch(body, metadata) {
        return this.core.fetch('/monitor_partner/comments/{id}', 'patch', body, metadata);
    }
    /**
     * Remove a comment and reset confirmed detection for a hash.
     *
     * @summary Remove a comment detection for a hash.
     */
    monitorpartnerCommentsDelete(metadata) {
        return this.core.fetch('/monitor_partner/comments/{id}', 'delete', metadata);
    }
    /**
     * Download a file with a given sha256 hash
     *
     */
    monitorpartnerFilesDownload(metadata) {
        return this.core.fetch('/monitor_partner/files/{sha256}/download', 'get', metadata);
    }
    /**
     * Retrieve a download url for a file with a given sha256 hash
     *
     */
    monitorpartnerFilesDownloadUrl(metadata) {
        return this.core.fetch('/monitor_partner/files/{sha256}/download_url', 'get', metadata);
    }
    /**
     * Download a daily detection bundle directly
     *
     */
    monitorpartnerDetectionsbundleDownload(metadata) {
        return this.core.fetch('/monitor_partner/detections_bundle/{engine_name}/download', 'get', metadata);
    }
    /**
     * Get a daily detection bundle download URL
     *
     */
    monitorpartnerDetectionsbundleDownloadUrl(metadata) {
        return this.core.fetch('/monitor_partner/detections_bundle/{engine_name}/download_url', 'get', metadata);
    }
    /**
     * Get a list of MonitorHashes detected by an engine
     *
     */
    monitorpartnerStatistics(metadata) {
        return this.core.fetch('/monitor_partner/statistics', 'get', metadata);
    }
    /**
     * Lists all your Alerts Assets
     *
     */
    assets(metadata) {
        return this.core.fetch('/alerts/assets', 'get', metadata);
    }
    /**
     * Create a new Alerts Asset
     *
     */
    watchlistsAssetsCreate(body, metadata) {
        return this.core.fetch('/alerts/assets', 'post', body, metadata);
    }
    /**
     * Get an Alerts Asset
     *
     */
    assetsid(metadata) {
        return this.core.fetch('/alerts/assets/{id}', 'get', metadata);
    }
    /**
     * Deletes the Alerts Asset
     *
     */
    watchlistsAssetsidDelete(metadata) {
        return this.core.fetch('/alerts/assets/{id}', 'delete', metadata);
    }
    /**
     * Lists Alerts Notifications
     *
     */
    notifications(metadata) {
        return this.core.fetch('/alerts/notifications', 'get', metadata);
    }
    /**
     * Get a single Alerts Notification
     *
     */
    notificationsid(metadata) {
        return this.core.fetch('/alerts/notifications/{id}', 'get', metadata);
    }
}
const createSDK = (() => { return new SDK(); })();
export default createSDK;
