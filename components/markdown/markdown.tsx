// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Team} from 'mattermost-redux/types/teams';
import {PostImage, PostType} from 'mattermost-redux/types/posts';
import {Dictionary} from 'mattermost-redux/types/utilities';
import crypto from "crypto";
import {buffer} from "bitwise";

import messageHtmlToComponent from 'utils/message_html_to_component';
import EmojiMap from 'utils/emoji_map';
import {ChannelNamesMap, TextFormattingOptions, formatText, MentionKey} from 'utils/text_formatting';

import {AcronymBloom, AcronymData} from "../../types/store";

type Props = {

    /*
     * An object mapping channel names to channels for the current team
     */
    channelNamesMap?: ChannelNamesMap;

    /*
     * An array of URL schemes that should be turned into links. Anything that looks
     * like a link will be turned into a link if this is not provided.
     */
    autolinkedUrlSchemes?: Array<string>;

    /*
     * Whether or not to do Markdown rendering
     */
    enableFormatting?: boolean;

    /*
     * Whether or not this text is part of the RHS
     */
    isRHS?: boolean;

    /*
     * An array of words that can be used to mention a user
     */
    mentionKeys?: Array<MentionKey>;

    /*
     * The text to be rendered
     */
    message: string;

    /*
     * Any additional text formatting options to be used
     */
    options: TextFormattingOptions;

    /*
     * The root Site URL for the page
     */
    siteURL?: string;

    /*
     * The current team
     */
    team?: Team;

    /**
     * If an image proxy is enabled.
     */
    hasImageProxy?: boolean;

    /**
     * Minimum number of characters in a hashtag.
     */
    minimumHashtagLength?: number;

    /**
     * Whether or not to proxy image URLs
     */
    proxyImages?: boolean;

    /**
     * Any extra props that should be passed into the image component
     */
    imageProps?: object;

    /**
     * prop for passed down to image component for dimensions
     */
    imagesMetadata?: Dictionary<PostImage>;

    /**
     * Whether or not to place the LinkTooltip component inside links
     */
    hasPluginTooltips?: boolean;

    /**
     * Post id prop passed down to markdown image
     */
    postId?: string;

    /**
     * Post id prop passed down to markdown image
     */
    postType?: PostType;
    emojiMap: EmojiMap;

    acronymBloom?: AcronymBloom;
}

interface Bloomable<T> {
    [key: string]: T;
}

export function calculateBloom<T>(termToKey: (p0: T) => string, terms: Bloomable<T>) {
    return {
        bloom: Object.values(terms).filter((term) => termToKey(term)).map((term) => crypto.createHash('sha256').update(termToKey(term).toLowerCase()).digest()).reduce((prev, current) => buffer.or(current, prev), Buffer.from([0])),
        terms: new Map(Object.entries(terms).map(([key, value]) => [key, {key, ...value}])),
    };
}

const key609 = "609";
const acronymBloom = calculateBloom((term: AcronymData) => term.Text, {
    mdi: {
        Text: 'MDI',
        Brief: 'Mission Data Integration',
        Definition:
            'Mission Data Integration refers to a group of applications that focus on back-end / data facilitation. These teams include but aren\'t limited to Ripsaw, Rebel Alliance, MaiTai, Skyhook.\n\nFor example:  Rebel Alliance facilitates the data flow from Jigsaw to Slapshot; Skyhook faciliates the movement of data into TBMCS...',
        Type: 'acronym',
    },
    ato: {
        Text: 'ATO',
        Brief: 'Air Tasking Order  -or- Authority To Operate',
        Definition:
            'Air Tasking Order: (also known as the Air Tasking Cycle) Refers to the operations and tasks that the Air Force completes on a given and pre-determined cycle (starting with strategy and intel, then mission planning, followed by mission execution and then assessment). Historically, this has been a 36-hour cycle, which doesn\'t afford immediate reponse. Kessel Run\'s mission is to tighten the ATO cycle so that we can sense and respond to threats in the battlespace quickly.\n\nAuthority To Operate: official approval from a designated authority to implement a project or plan, or to continue operating within pre-determined and pre-approved protocol.',
        Type: 'acronym',
    },
    atc: {
        Text: 'ATC',
        Brief: 'Air Tasking Cycle ',
        Definition:
            'Air Tasking Cycle: (also known as the Air Tasking Order) Refers to the operations and tasks that the Air Force completes on a given and pre-determined cycle (starting with strategy and intel, then mission planning, followed by mission execution and then assessment). Historically, this has been a 36-hour cycle, which doesn\'t afford immediate reponse. Kessel Run\'s mission is to tighten the ATO cycle so that we can sense and respond to threats in the battlespace quickly.',
        Type: 'acronym',
    },
    [key609]: {
        Text: '609',
        Brief:
            'the Air Operations Center (AOC) located in the Joint Air Base in Al Udeid, Qatar',
        Type: 'jargon',
    },
    unclass: {
        Text: 'UNCLASS',
        Brief:
            'unclassified information	Unclassified is a security classification assigned to official information that does not warrant the assignment of Confidential, Secret, or Top Secret markings but which is not publicly-releasable without authorization.',
        Type: 'jargon',
    },
    fouo: {
        Text: 'FOUO',
        Brief:
            'For Official Use Only	For Official Use Only is a document designation, not a classification. This designation is used by DoD (Department of Defense) and a number of other federal agencies to identify information or material which, although unclassified, may not be appropriate for public release.',
        Type: 'acronym',
    },
    secaf: {
        Text: 'SecAF',
        Brief:
            'Secretary of the Air Force	The secretary of the Air Force is the head of the Department of the Air Force and is a civilian appointed by the president, by and with the advice and consent of the Senate. The secretary reports to the SecDef (Secretary of Defense) and is by statute responsible for and has the authority to conduct all the affairs of the Department of the Air Force. The current secretary of the Air Force is Barbara Barrett who was sworn into office on October 18, 2019.',
    },
    sipr: {
        Text: 'SIPR',
        Brief:
            'short for SIPRNet -- Secret Internet Protocol Router Network	A system of interconnected computer networks used by the DoD (Department of Defense) and DoS (Department of State) to transmit classified information (up to and including information classified SECRET) over a \'completely secure\' environment.\'',
        Type: 'acronym',
    },
    nipr: {
        Text: 'NIPR',
        Brief:
            'short for NIPRNet -- Non-classified Internet Protocol Router Network	A private network used to exchange unclassified information, including information subject to controls on distribution, among the network\'s users. NIPRNet also provides its users access to the Internet.',
        Type: 'acronym',
    },
    govcloud: {
        Text: 'GovCloud',
        Brief:
            'AWS (Amazaon Web Services) for Government	Similar to Sc2s and C2s, a distinct set of Amazon Web Services infrastructure located on US soil and available to the US government which has been approved by the DOJ (Department Of Justice) and DoD (Department of Defense) among others to handle information up to CUI (Controlled Unclassified Information) level.',
        Type: 'jargon',
    },
    sc2s: {
        Text: 'Sc2s',
        Brief:
            'Strategic Command and Control Software (part of AWS)	Similar to GovCloud and C2S, a distinct set of Amazon Web Services infrastructure located on US soil and available to the US government which has been approved by the DOJ (Department Of Justice) and DoD (Department of Defense) among others to handle information up to Secret level.',
        Type: 'acronym',
    },
    c2s: {
        Text: 'C2s',
        Brief:
            'Commercial Cloud Services (part of AWS)	Similar to GovCloud and Sc2S, a distinct set of Amazon Web Services infrastructure located on US soil and available to the US government which has been approved by the DOJ (Department Of Justice) and DoD (Department of Defense) among others to handle information up to Top Secret level.',
        Type: 'acronym',
    },
    tdy: {
        Text: 'TDY',
        Brief:
            'Temporary Duty	When a military member is sent on temporary duty to a different location. ',
        Type: 'acronym',
    },
    kres: {
        Text: 'KRES',
        Brief:
            'Kessel Run Enterprise Services	The the divisions of Kessel Run that provide ancillary service including acquisitions and tools procurements, security, (cyber and hardware) HR functions, and IT tools support (Help Desk)',
        Type: 'acronym',
    },
    adcp: {
        Text: 'ADCP',
        Brief:
            'Kessel Run All Domain Common Platform	The common underlying infrastructure upon which all Kessel Run software is supported. This includes AWS (Amazon Web Service) platforms and service platforms at other AOC (Air Operations Center) locations',
        Type: 'acronym',
    },
    10.1: {
        Text: '10.1',
        Brief: '',
        Definition:
            'Refers to legacy systems and processes (and the teams that keep them running) that came into use in USAF in the 1990\'s and early 2000\'s, many of which Kessel Run is seeking to deprecate. Examples include TBMCS, MAAPTK, JTT.\n\n Block 20 (B20) applications seek to deprecate many of these legacy systems that can no longer support major theater war or distributed ops.',
        Type: 'jargon',
    },
    'block 20': {
        Text: 'Block 20',
        Brief:
            'Block 20 or B20	Block 20 applications are the new software being developed and implemented in the USAF, largely stemming from the Detachment 12 / Kessel Run software factory. Some applications include ____',
        Type: 'jargon',
    },
    b20: {
        Text: 'B20',
        Brief:
            'B20 or Block 20	Block 20 applications are the new software being developed and implemented in the USAF, largely stemming from the Detachment 12 / Kessel Run software factory. Some applications include ____',
        Type: 'acronym',
    },
    'distributed ops': {
        Text: 'Distributed Ops',
        Brief: 'Distributed Operations',
        Definition:
            'Distributed operations relates to the USAF\'s goal to have combat capability be possible in any domain, any time, anywhere. For example: if an air base becomes non-functional, the planning and execution information that was in process should be available to other AF locations to continue missions.\n\nThis includes fallbacks, cloud services______',
    },
    disa: {
        Text: 'DISA',
        Brief:
            'Defense Information Systems Agency	DISA is a combat support agency of the Department of Defense (DoD) that provides command and control and information-sharing capabilities and a globally accessible enterprise information infrastructure in direct support of warfighters, national level leaders, and other mission and coalition partners across the full spectrum of military operations.',
        Type: 'acronym',
    },
    ipm: {Text: 'IPM', Brief: '', Type: 'acronym'},
    acquisitions: {
        Text: 'acquisitions',
        Brief: '',
        Definition:
            'The Air Force\'s procurement process for software and other tools',
        Type: 'jargon',
    },
    hackathon: {
        Text: 'Hackathon',
        Brief:
            'A sprint event formed around a defined theme designed to encourage innovation and teamwork to solve current problems faced by the organization.',
        Type: 'jargon',
    },
    devsecops: {
        Text: 'devsecops',
        Brief:
            'Software created with security built in to the development process and operational uses.',
    },
    wrt: {
        Text: 'WRT',
        Brief: 'with regard to	',
        Type: 'acronym',
    },
    imho: {
        Text: 'IMHO',
        Brief: 'in my humble opinion (similar to in my opinion)	',
        Type: 'acronym',
    },
    imo: {
        Text: 'IMO',
        Brief: 'in my opinion (similar to in my humble opinion)	',
        Type: 'acronym',
    },
    afaik: {
        Text: 'AFAIK',
        Brief: 'as far as I know	',
        Type: 'acronym',
    },
} as Bloomable<AcronymData>);

export default class Markdown extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        options: {},
        isRHS: false,
        proxyImages: true,
        acronymBloom,

        // acronymBloom: {
        //     bloom: Buffer.from("fc99459c7aa02481042852e5093ef8683cf9c763f2c505b39869176fdf7ea8ff", 'hex'),
        //     terms: new Map<string, AcronymData>([["dod", {
        //         key: "dod",
        //         Text: "DOD",
        //         Brief: "Department Of Davids",
        //         Definition: "Uncle Sam's Servants"
        //     }]])
        // },
        imagesMetadata: {},
        postId: '', // Needed to avoid proptypes console errors for cases like channel header, which doesn't have a proper value
    }

    render() {
        if (!this.props.enableFormatting) {
            return <span>{this.props.message}</span>;
        }

        const options = Object.assign({
            autolinkedUrlSchemes: this.props.autolinkedUrlSchemes,
            siteURL: this.props.siteURL,
            mentionKeys: this.props.mentionKeys,
            atMentions: true,
            channelNamesMap: this.props.channelNamesMap,
            proxyImages: this.props.hasImageProxy && this.props.proxyImages,
            team: this.props.team,
            minimumHashtagLength: this.props.minimumHashtagLength,
        }, this.props.options);

        const htmlFormattedText = formatText(this.props.message, options, this.props.emojiMap, this.props.acronymBloom);
        return messageHtmlToComponent(htmlFormattedText, this.props.isRHS, {
            imageProps: this.props.imageProps,
            imagesMetadata: this.props.imagesMetadata,
            hasPluginTooltips: this.props.hasPluginTooltips,
            postId: this.props.postId,
            postType: this.props.postType,
            mentionHighlight: this.props.options.mentionHighlight,
            disableGroupHighlight: this.props.options.disableGroupHighlight,
        });
    }
}
