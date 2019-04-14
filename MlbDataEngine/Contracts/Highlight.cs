using System;
using System.Collections.Generic;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts
{
    [Serializable, XmlRoot("media")]
    public class Highlight
    {
        [XmlAttribute("type")]
        public string type { get; set; }

        [XmlAttribute("id")]
        public long id { get; set; }

        [XmlAttribute("date")]
        public string date { get; set; }

        [XmlElement("player")]
        public Players players { get; set; }

        [XmlElement("team")]
        public Team team { get; set; }

        public DateTime dateObj => DateTime.Parse(date, CultureInfo.InvariantCulture);

        [XmlElement("headline")]
        public string headline { get; set; }

        [XmlElement("blurb")]
        public string blurb { get; set; }

        [XmlElement("bigblurb")]
        public string bigblurb { get; set; }

        [XmlElement("duration")]
        public string duration { get; set; }

        [XmlElement("url")]
        public string[] url { get; set; }

        [XmlElement("thumb")]
        public string thumb { get; set; }

        [XmlArray("thumbnails")]
        [XmlArrayItem("thumb")]
        public string[] thumbnails { get; set; }

        [XmlArray("keywords")]
        [XmlArrayItem("keyword")]
        public Keyword[] keywords { get; set; }

        [XmlAttribute("condensed")]
        public bool condensed { get; set; }

        [XmlAttribute("recap")]
        public bool recap { get; set; }
    }

    [Serializable]
    public class HighlightJson
    {
        public string type { get; set; }
        public string state { get; set; }
        public string date { get; set; }
        public string id { get; set; }
        public string headline { get; set; }
        public string seoTitle { get; set; }
        public string slug { get; set; }
        public ArticleImage image { get; set; }
        public string blurb { get; set; }
        public IEnumerable<KeywordJson> keywordsAll { get; set; }
        public string topic_id { get; set; }
        public bool noIndex { get; set; }
        public string mediaPlaybackId { get; set; }
        public string title { get; set; }
        public string kicker { get; set; }
        public string description { get; set; }
        public string duration { get; set; }
        public string language { get; set; }
        public string guid { get; set; }
        public string mediaState { get; set; }
        public IEnumerable<MediaItemPlayback> playbacks { get; set; }
    }

    [Serializable]
    public class ArticleImage
    {
        public string title { get; set; }
        public string altText { get; set; }
        public IEnumerable<ArticleImageOfSize> cuts { get; set; }
    }

    [Serializable]
    public class ArticleImageOfSize
    {
        public string aspectRatio { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public string src { get; set; }
        public string at2x { get; set; }
        public string at3x { get; set; }
    }

    [Serializable]
    public class KeywordJson
    {
        public string type { get; set; }
        public string value { get; set; }
        public string displayName { get; set; }
    }

    public class MediaItemPlayback
    {
        public string name { get; set; }
        public string width { get; set; }
        public string height { get; set; }
        public string url { get; set; }
    }

}
