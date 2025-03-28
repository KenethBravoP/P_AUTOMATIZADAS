const mappers = require('./mappers');
const gating = require('./utils/post-gating');
const tiersService = require('../../../../../services/tiers');

module.exports = {
    async read(model, apiConfig, frame) {
        const tiersPage = await tiersService.api.browse({});
        const tiers = tiersPage.data?.map((tierModel) => {
            const json = tierModel.toJSON();
            return {
                id: json.id,
                name: json.name,
                slug: json.slug,
                active: json.status === 'active',
                welcome_page_url: json.welcomePageURL,
                visibility: json.visibility,
                trial_days: json.trialDays,
                description: json.description,
                type: json.type,
                currency: json.type === 'paid' ? json.currency?.toLowerCase() : null,
                monthly_price: json.monthlyPrice,
                yearly_price: json.yearlyPrice,
                created_at: json.createdAt,
                updated_at: json.updatedAt,
                monthly_price_id: null,
                yearly_price_id: null
            };
        }) || [];
        const emailPost = await mappers.posts(model, frame, {tiers});
        gating.forPost(emailPost, frame);

        frame.response = {
            email_posts: [emailPost]
        };
    }
};
