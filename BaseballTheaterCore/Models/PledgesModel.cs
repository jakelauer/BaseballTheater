using System;
using System.Linq;
using System.Security.Claims;

namespace BaseballTheaterCore.Models
{
    [Flags]
    public enum FeatureFlags
    {
        None = 0,
        Beta = 1,
        LiveData = 2,
        TeamSchedule = 4
    }

    public class PledgesModel
    {
        private const int Level1Id = 1447733;
        private const int Level2Id = 1447732;
        private const int Level3Id = 1447729;
        private const int Level4Id = 1447731;

        private static FeatureFlags GetFeaturesForPledge(int rewardId)
        {
            switch (rewardId)
            {
                case Level1Id: return FeatureFlags.Beta;
                case Level2Id: return FeatureFlags.Beta | FeatureFlags.LiveData;
                case Level3Id: return FeatureFlags.Beta | FeatureFlags.LiveData | FeatureFlags.TeamSchedule;
                case Level4Id: return FeatureFlags.Beta | FeatureFlags.LiveData | FeatureFlags.TeamSchedule;
                default: return FeatureFlags.None;
            }
        }
        
        public static FeatureFlags GetRewardTierForUser(ClaimsPrincipal user)
        {
            var rewardId = user.Claims.FirstOrDefault(a => a.Type == "RewardId");
            if (rewardId != null)
            {
                return GetFeaturesForPledge(int.Parse(rewardId.Value));
            }

            return FeatureFlags.None;
        }

    }
}