<?php
namespace Application\Controller;

use TypeError;
use LeoGalleguillos\ThreeDimensions\Model\Entity as ThreeDimensionsEntity;
use LeoGalleguillos\ThreeDimensions\Model\Factory as ThreeDimensionsFactory;
use LeoGalleguillos\ThreeDimensions\Model\Service as ThreeDimensionsService;
use LeoGalleguillos\ThreeDimensions\Model\Table as ThreeDimensionsTable;
use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Ground extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsService\Ground\Grounds $groundsService
    ) {
        $this->groundsService = $groundsService;
    }

    public function getRelevantGroundAction()
    {
        $groundEntities = [];
        $generator = $this->groundsService->getGrounds();
        foreach ($generator as $groundEntity) {
            $groundEntities[] = $groundEntity;
        }

        $this->getResponse()
             ->getHeaders()
             ->addHeaderLine('Content-type', 'application/json');

        return [
            'groundEntities' => $groundEntities,
        ];
    }
}
