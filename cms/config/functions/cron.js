module.exports = {
    '*/1 * * * *': async ({ strapi }) => {
      const now = new Date();
      

      // Публикация записей
      const { results: entriesToPublish } = await strapi.api.promotion.services.promotion.find({
        publicationState: 'preview',
        filters: {
            publishedAt: {
              $null: true,
            },
            publish_at: {
              $lt: now
            }
          }
      });
    
      await Promise.all(entriesToPublish.map(promotion => {
        return strapi.entityService.update('api::promotion.promotion', promotion.id, {
          data: {
            publishedAt: now,
          }
        });
      }))

      // Снятие с публикации записей

      const { results: entriesToUnpublish } = await strapi.api.promotion.services.promotion.find({
        publicationState: 'live',
        filters: {
            unpublish_at: {
                $lt: now
            }
          }
      });

      await Promise.all(entriesToUnpublish.map(promotion => {
        return strapi.entityService.update('api::promotion.promotion', promotion.id, {
          data: {
            publicationState: "preview",
            publishedAt: null,
          }
        });
      }))
    },
  };
  